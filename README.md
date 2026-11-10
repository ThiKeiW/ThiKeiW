<!-- ============================================================
     Diseño en bloques: SVG propios (assets/) + tarjetas de github-stats-extended.
     Todo va dentro de un solo <div>. Columna izquierda = align="left",
     columna derecha = align="right". El ORDEN de las etiquetas importa.
     NOTA: GitHub agrega 20 px de relleno a cada imagen con align="left"/"right",
     por eso las dos columnas suman 94% (36% + 58%), no 100%.
     ============================================================ -->
<div>

<!-- BLOQUE 1: ENCABEZADO (HOLA, SOY / sThiKeiW. + avatar embebido) -->
<img src="./assets/header.svg" alt="Hola, soy sThiKeiW" width="100%" align="top" />

<!-- BLOQUE 2: CONECTA CONMIGO (etiqueta a la izquierda, botones alineados a la derecha) -->
<img src="./assets/contacto-label.svg" alt="Conecta conmigo" width="22%" align="left" />
<div align="right">
<a href="https://www.linkedin.com/in/kevin-chate-perez-b24749416/"><img src="./assets/contacto-linkedin.svg" alt="LinkedIn" width="12.1%" align="middle" /></a>&nbsp;
<a href="mailto:kevinarian23@gmail.com"><img src="./assets/contacto-correo.svg" alt="Correo" width="10.2%" align="middle" /></a>&nbsp;
<a href="https://wa.me/51990820991"><img src="./assets/contacto-whatsapp.svg" alt="WhatsApp" width="13.3%" align="middle" /></a>
</div>

<!-- Línea divisoria (también corta el flotado de la fila de contacto) -->
<img src="./assets/rule.svg" alt="" width="100%" align="top" />

<!-- BLOQUE 3: SOBRE MÍ (izquierda, arriba) -->
<img src="./assets/sobre-mi.svg" alt="Sobre mí" width="36%" align="left" />

<!-- BLOQUE 4: PROYECTOS DESTACADOS (derecha) -->
<img src="./assets/proyectos-header.svg" alt="Proyectos destacados" width="58%" align="right" />

<a href="https://github.com/ThiKeiW/lol-info-movil"><img src="https://github-stats-extended.vercel.app/api/pin/?username=ThiKeiW&repo=lol-info-movil&theme=github_dark&border_color=2a313c&border_radius=10" alt="lol-info-movil" width="58%" align="right" /></a>
<img src="./assets/space-10.svg" alt="" width="58%" align="right" />
<a href="https://github.com/ThiKeiW/Portal-Tramites-Centralizados"><img src="https://github-stats-extended.vercel.app/api/pin/?username=ThiKeiW&repo=Portal-Tramites-Centralizados&theme=github_dark&border_color=2a313c&border_radius=10" alt="Portal-Tramites-Centralizados" width="58%" align="right" /></a>

<!-- BLOQUE 5: LENGUAJES MÁS USADOS (izquierda, abajo) — github-stats-extended -->
<img src="https://github-stats-extended.vercel.app/api/top-langs/?username=ThiKeiW&layout=compact&langs_count=4&theme=github_dark&border_color=2a313c&border_radius=10&custom_title=Lenguajes+m%C3%A1s+usados" alt="Lenguajes más usados" width="36%" align="left" />

<!-- FRASE (derecha, bajo los proyectos). Color: editar fill en assets/frase.svg -->
<img src="./assets/space-18.svg" alt="" width="58%" align="right" />
<img src="./assets/frase.svg" alt="No importa cuánto tiempo tengas, sino cómo lo usas" width="58%" align="right" />

</div>
