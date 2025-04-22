export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        html.head.push(
            `<!-- HTML Meta Tags -->
<title>Mediari Consultoria - Especialistas em Direito para Empresas e Pessoas Físicas</title>
<meta name="description" content="Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.">

<!-- Facebook Meta Tags -->
<meta property="og:url" content="https://mediari-consultoria.netlify.app/">
<meta property="og:type" content="website">
<meta property="og:title" content="Mediari Consultoria - Especialistas em Direito para Empresas e Pessoas Físicas">
<meta property="og:description" content="Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.">
<meta property="og:image" content="https://mediari-consultoria.netlify.app/mediari-og-image.webp">

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="mediari-consultoria.netlify.app">
<meta property="twitter:url" content="https://mediari-consultoria.netlify.app/">
<meta name="twitter:title" content="Mediari Consultoria - Especialistas em Direito para Empresas e Pessoas Físicas">
<meta name="twitter:description" content="Consultoria jurídica para pequenas e médias empresas e pessoas físicas. Especialistas em Direito Trabalhista, Bancário e do Consumidor.">
<meta name="twitter:image" content="https://mediari-consultoria.netlify.app/mediari-og-image.webp">

<!-- Meta Tags Generated via https://www.opengraph.xyz -->`
        )
    })
})