
"""
Parent type for all dimensional arrays.
"""
abstract type AbstractDimensionalArray{T,N,D<:Tuple,A} <: AbstractArray{T,N} end

const AbDimArray = AbstractDimensionalArray

const StandardIndices = Union{AbstractArray,Colon,Integer}

# Interface methods ############################################################

dims(A::AbDimArray) = A.dims
@inline rebuild(A::AbstractArray, data, dims::Tuple=dims(A), refdims=refdims(A)) =
    rebuild(A, data, dims, refdims, name(A))
# Rebuild for name-updating methods, to avoid having to add dims and refdims
@inline rebuild(A::AbstractArray, data, name::String) =
    rebuild(A, data, dims(A), refdims(A), name)


# Array interface methods ######################################################

Base.size(A::AbDimArray) = size(data(A))
Base.iterate(A::AbDimArray, args...) = iterate(data(A), args...)
Base.IndexStyle(A::AbstractDimensionalArray) = Base.IndexStyle(data(A))

Base.@propagate_inbounds Base.getindex(A::AbDimArray{<:Any, N}, I::Vararg{<:Integer, N}) where N =
    getindex(data(A), I...)
Base.@propagate_inbounds Base.getindex(A::AbDimArray, I::Vararg{<:StandardIndices}) =
    rebuildsliced(A, getindex(data(A), I...), I)

# Linear indexing
Base.@propagate_inbounds Base.getindex(A::AbDimArray{<:Any, N} where N, I::StandardIndices) =
    getindex(data(A), I)
# Exempt 1D DimArrays
Base.@propagate_inbounds Base.getindex(A::AbDimArray{<:Any, 1}, I::Union{Colon, AbstractArray}) =
    rebuildsliced(A, getindex(data(A), I), (I,))

Base.@propagate_inbounds Base.view(A::AbDimArray, I::Vararg{<:StandardIndices}) =
    rebuildsliced(A, view(data(A), I...), I)
Base.@propagate_inbounds Base.view(A::AbDimArray{<:Any, 1}, I::StandardIndices) =
    rebuildsliced(A, view(data(A), I), (I,))
Base.@propagate_inbounds Base.view(A::AbDimArray{<:Any, N} where N, I::StandardIndices) =
    view(data(A), I)

Base.@propagate_inbounds Base.setindex!(A::AbDimArray, x, I::Vararg{StandardIndices}) =
    setindex!(data(A), x, I...)

Base.copy(A::AbDimArray) = rebuild(A, copy(data(A)))
Base.copy!(dst::AbDimArray, src::AbDimArray) = copy!(data(dst), data(src))
Base.copy!(dst::AbDimArray, src::AbstractArray) = copy!(data(dst), src)
Base.copy!(dst::AbstractArray, src::AbDimArray) = copy!(dst, data(src))
Base.Array(A::AbDimArray) = data(A)

# Need to cover a few type signatures to avoid ambiguity with base
# Don't remove these even though they look redundant
Base.similar(A::AbDimArray) = rebuild(A, similar(data(A)), "")
Base.similar(A::AbDimArray, ::Type{T}) where T = rebuild(A, similar(data(A), T), "")
Base.similar(A::AbDimArray, ::Type{T}, I::Tuple{Int64,Vararg{Int64}}) where T =
    rebuild(A, similar(data(A), T, I), "")
Base.similar(A::AbDimArray, ::Type{T}, I::Tuple{Union{Integer,AbstractRange},Vararg{Union{Integer,AbstractRange},N}}) where {T,N} =
    rebuildsliced(A, similar(data(A), T, I...), I, "")
Base.similar(A::AbDimArray, ::Type{T}, I::Vararg{<:Integer}) where T =
    rebuildsliced(A, similar(data(A), T, I...), I, "")
Base.similar(bc::Broadcast.Broadcasted{Broadcast.ArrayStyle{AbDimArray}}, ::Type{ElType}) where ElType = begin
    A = find_dimensional(bc)
    # TODO How do we know what the new dims are?
    rebuildsliced(A, similar(Array{ElType}, axes(bc)), axes(bc), "")
end

@inline find_dimensional(bc::Base.Broadcast.Broadcasted) = find_dimensional(bc.args)
@inline find_dimensional(ext::Base.Broadcast.Extruded) = find_dimensional(ext.x)
@inline find_dimensional(args::Tuple{}) = error("dimensional array not found")
@inline find_dimensional(args::Tuple) = find_dimensional(find_dimensional(args[1]), tail(args))
@inline find_dimensional(x) = x
@inline find_dimensional(A::AbDimArray, rest) = A
@inline find_dimensional(::Any, rest) = find_dimensional(rest)


# Concrete implementation ######################################################

"""
    DimensionalArray(data, dims, refdims, name)

The main subtype of `AbstractDimensionalArray`.
Maintains and updates its dimensions through transformations and moves dimensions to
`refdims` after reducing operations (like e.g. `mean`).
"""
struct DimensionalArray{T,N,D<:Tuple,R<:Tuple,A<:AbstractArray{T,N}} <: AbstractDimensionalArray{T,N,D,A}
    data::A
    dims::D
    refdims::R
    name::String
    function DimensionalArray(data::A, dims::D, refdims::R, name::String) where A <:AbstractArray{T,N} where D where R where T where N
        if length.(dims) != size(data)
            throw(DimensionMismatch(
                "dims must have same size as data. This was not true for $dims and size $(size(data)) $(A)."
            ))
        end
        new{T, N, D, R, A}(data, dims, refdims, name)
    end
end
"""
    DimensionalArray(data, dims::Tuple [, name::String]; refdims=())
Constructor with optional `name` and `refdims`.
The `name` is propagated across most sensible operations, even reducing ones.

Example:
```julia
using Dates, DimensionalData
timespan = DateTime(2001):Month(1):DateTime(2001,12)
A = DimensionalArray(rand(12,10), (Ti(timespan), X(10:10:100)))
A[X<|Near([12, 35]), Ti<|At(DateTime(2001,5))]
A[Near(DateTime(2001, 5, 4)), Between(20, 50)]
```
"""
DimensionalArray(A::AbstractArray, dims, name::String = ""; refdims=()) =
    DimensionalArray(A, formatdims(A, _to_tuple(dims)), refdims, name)
_to_tuple(t::T where T <: Tuple) = t
_to_tuple(t) = tuple(t)

# Getters
refdims(A::DimensionalArray) = A.refdims
data(A::DimensionalArray) = A.data
name(A::DimensionalArray) = A.name
label(A::DimensionalArray) = name(A)

# DimensionalArray interface
@inline rebuild(A::DimensionalArray, data::AbstractArray, dims::Tuple,
                refdims::Tuple, name::String) =
    DimensionalArray(data, dims, refdims, name)

# Array interface (AbstractDimensionalArray takes care of everything else)
Base.@propagate_inbounds Base.setindex!(A::DimensionalArray, x, I::Vararg{StandardIndices}) =
    setindex!(data(A), x, I...)

# Applying function across dimension should give an Array
"""
    DimensionalArray(f::Function, dim::AbDim [, name])

Apply function `f` across the values of the dimension `dim`
(using broadcasting), and return the result as a dimensional array with
the given dimension. Optionally provide a name for the result.
"""
DimensionalArray(f::Function, dim::AbDim, name=string(nameof(f))*"("*name(dim)*")") =
DimensionalArray(f.(val(dim)), (dim,), name)

