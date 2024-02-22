import{_ as s,c as i,o as a,V as n}from"./chunks/framework.af9mHj2H.js";const o=JSON.parse('{"title":"Example","description":"","frontmatter":{},"headers":[],"relativePath":"diskarrays.md","filePath":"diskarrays.md","lastUpdated":null}'),e={name:"diskarrays.md"},l=n(`<h3 id="diskarrays-jl-compatability-diskarrays-jl-compatability" tabindex="-1"><a href="https://github.com/meggart/DiskArrays.jl" target="_blank" rel="noreferrer">DiskArrays.jl</a> compatability {#<a href="https://github.com/meggart/DiskArrays.jl" target="_blank" rel="noreferrer">DiskArrays.jl</a>-compatability} <a class="header-anchor" href="#diskarrays-jl-compatability-diskarrays-jl-compatability" aria-label="Permalink to &quot;[DiskArrays.jl](https://github.com/meggart/DiskArrays.jl) compatability {#[DiskArrays.jl](https://github.com/meggart/DiskArrays.jl)-compatability}&quot;">​</a></h3><p>The combination of DiskArrays.jl and DimensionalData.jl is Julias answer to pythons <a href="https://xarray.dev/" target="_blank" rel="noreferrer">xarray</a>.</p><p>Rasters.jl and YAXArrays.jl are the user-facing tools building on this combination.</p><p>DiskArrays.jl is rarely used directly by users, but is present in most disk and cloud based spatial data packages in julia, including:</p><ul><li><p>ArchGDAL.jl</p></li><li><p>NetCDF.jl</p></li><li><p>Zarr.jl</p></li><li><p>NCDatasets.lj</p></li><li><p>GRIBDatasets.jl</p></li><li><p>CommonDataModel.jl</p></li><li><p>etc...</p></li></ul><p>So that lazy, chunked data access conforms to julias array interface but also scales to operating on terrabytes of data.</p><p>DiskArrays enables chunk ordered lazy application of:</p><ul><li><p>broadcast</p></li><li><p>reduce</p></li><li><p>iteration</p></li><li><p>generators</p></li><li><p>zip</p></li></ul><p>DimensionalData.jl is a common front-end for accessing DiskArrays.jl compatible datasets. Wherever An <code>AbstractDimArray</code> wraps a disk array we will do our best to make sure all of the DimensionalData.jl indexing and DiskArrays.jl lazy/chunked operations work together cleanly.</p><p>They have no direct dependency relationships, with but are intentionally designed to integrate via both adherence to julias <code>AbstractArray</code> interface, and by coordination during development of both packages.</p><h1 id="Example" tabindex="-1">Example <a class="header-anchor" href="#Example" aria-label="Permalink to &quot;Example {#Example}&quot;">​</a></h1><p>Out of the box integration.</p><p>DimensionalData.jl and DiskArrays.jl play nice no matter the size of the data. To make this all work in CI we will simulate some huge data by multiplying a huge <code>BitArray</code> with a <code>BigInt</code>, meant to make it 128 x larger in memory.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DimensionalData, DiskArrays</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       # This holds is a 100_100 * 50_000 \`BitArray\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> A </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> trues</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100_000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50_000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">100000×50000 BitMatrix:</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1  …  1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1  …  1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> ⋮              ⋮              ⋮        ⋱        ⋮              ⋮</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1  …  1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> 1  1  1  1  1  1  1  1  1  1  1  1  1     1  1  1  1  1  1  1  1  1  1  1  1</span></span></code></pre></div><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> diska </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DiskArrays</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TestTypes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AccessCountDiskArray</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(A; chunksize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">100000×50000 DiskArrays.TestTypes.AccessCountDiskArray{Bool, 2, BitMatrix}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">Chunked: 1000×500 DiskArrays.GridChunks{2, Tuple{DiskArrays.RegularChunks, DiskArrays.RegularChunks}}:</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (1:100, 1:100)         …  (1:100, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (101:200, 1:100)          (101:200, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (201:300, 1:100)          (201:300, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (301:400, 1:100)          (301:400, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (401:500, 1:100)          (401:500, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (501:600, 1:100)       …  (501:600, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (601:700, 1:100)          (601:700, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (701:800, 1:100)          (701:800, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (801:900, 1:100)          (801:900, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (901:1000, 1:100)         (901:1000, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> ⋮                      ⋱</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99101:99200, 1:100)      (99101:99200, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99201:99300, 1:100)      (99201:99300, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99301:99400, 1:100)      (99301:99400, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99401:99500, 1:100)      (99401:99500, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99501:99600, 1:100)   …  (99501:99600, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99601:99700, 1:100)      (99601:99700, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99701:99800, 1:100)      (99701:99800, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99801:99900, 1:100)      (99801:99900, 49901:50000)</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> (99901:100000, 1:100)     (99901:100000, 49901:50000)</span></span></code></pre></div><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dima </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> DimArray</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(diska, (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">X</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.01</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.01</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Y</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.02</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.02</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)))</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">╭───────────────────────────────╮</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">│ </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">100000</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">×</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">50000</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> DimArray{Bool,2}</span><span style="--shiki-light:#959da5;--shiki-dark:#959da5;"> │</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">├───────────────────────────────┴──────────────────────────────── dims ┐</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">  ↓ </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">X</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> Sampled{Float64} </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">0.01:0.01:1000.0</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> ForwardOrdered</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Regular</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Points</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">,</span></span>
<span class="line"><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  → </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">Y</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> Sampled{Float64} </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">0.02:0.02:1000.0</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> ForwardOrdered</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Regular</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Points</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">└──────────────────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">    ↓</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;"> →</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">   0.02</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  0.04</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  0.06</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  0.08</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  0.1</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  …  </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">999.94</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  999.96</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  999.98</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  1000.0</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">    0.01</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">    0.02</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">    0.03</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">    0.04</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">    ⋮                             ⋮    ⋱                    ⋮</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">  999.96</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">  999.97</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">  999.98</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">  999.99</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 1000.0</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">   1     1     1     1     1    …    1       1       1        1</span></span></code></pre></div><h1 id="How-big-is-this-thing?" tabindex="-1">How big is this thing? <a class="header-anchor" href="#How-big-is-this-thing?" aria-label="Permalink to &quot;How big is this thing? {#How-big-is-this-thing?}&quot;">​</a></h1><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> GB </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sizeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(A) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1e9</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">0.625</span></span></code></pre></div><p>Now if we multiply that by 2.0 they will be Float64, ie 64 x larger.</p><p>But:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dimb </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> view</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">permutedims</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dima </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> BigInt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200000000000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), (X, Y)); X</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">99999</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">╭────────────────────────────────╮</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">│ </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">99999</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">×</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">50000</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> DimArray{BigInt,2}</span><span style="--shiki-light:#959da5;--shiki-dark:#959da5;"> │</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">├────────────────────────────────┴─────────────────────────────── dims ┐</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">  ↓ </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">X</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> Sampled{Float64} </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">0.01:0.01:999.99</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> ForwardOrdered</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Regular</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Points</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">,</span></span>
<span class="line"><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  → </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">Y</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> Sampled{Float64} </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">0.02:0.02:1000.0</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> ForwardOrdered</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Regular</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Points</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">└──────────────────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">   ↓</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;"> →</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">              0.02</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">             0.04</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  …           </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">999.98</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">          1000.0</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">   0.01</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">   0.02</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">   0.03</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">   0.04</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">   ⋮                                       ⋱             ⋮</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 999.95</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 999.96</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 999.97</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 999.98</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 999.99</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000     …  200000000000     200000000000</span></span></code></pre></div><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sizeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dimb)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">208</span></span></code></pre></div><p>The size should be:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> GB </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">sizeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">eltype</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dimb)) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> prod</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dimb))) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1e9</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">79.9992</span></span></code></pre></div><p>I&#39;m writing this on a laptop with only 32Gb or ram, but this runs instantly.</p><p>The trick is nothing happens until we index:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> diska</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">getindex_count</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">Base.RefValue{Int64}(8)</span></span></code></pre></div><p>These are just access for printing in the repl!</p><p>When we actually get data the calulations happen, and for real disk arrays the chunked reads too:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">julia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dimb[X</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Y</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">╭───────────────────────────╮</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">│ </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">100</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">×</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">10</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> DimArray{BigInt,2}</span><span style="--shiki-light:#959da5;--shiki-dark:#959da5;"> │</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">├───────────────────────────┴───────────────────────────────── dims ┐</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">  ↓ </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">X</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> Sampled{Float64} </span><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;">0.01:0.01:1.0</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> ForwardOrdered</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Regular</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Points</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">,</span></span>
<span class="line"><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">  → </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">Y</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> Sampled{Float64} </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">0.02:0.02:0.2</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> ForwardOrdered</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Regular</span><span style="--shiki-light:#808080;--shiki-dark:#808080;"> Points</span></span>
<span class="line"><span style="--shiki-light:#959da5;--shiki-dark:#959da5;">└───────────────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> ↓</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;"> →</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">              0.02</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">             0.04</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  …             </span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">0.18</span><span style="--shiki-light:#0087d7;--shiki-dark:#0087d7;">             0.2</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 0.01</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 0.02</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 0.03</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 0.04</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;"> ⋮                                       ⋱                              ⋮</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 0.96</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 0.97</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 0.98</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 0.99</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span style="--shiki-light:#ff875f;--shiki-dark:#ff875f;"> 1.0</span><span style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;">   200000000000     200000000000     …  200000000000     200000000000</span></span></code></pre></div>`,39),h=[l];function p(t,k,d,r,g,y){return a(),i("div",null,h)}const f=s(e,[["render",p]]);export{o as __pageData,f as default};
