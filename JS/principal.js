/* =============================================================
   FENRIR SNOW · PORTAFOLIO
   JavaScript compartido por TODO el sitio.
   -------------------------------------------------------------
   Qué hace:
   1) Abre/cierra el menú en móvil.
   2) Hace funcionar los filtros de categorías.
   3) Abre el pop-up de detalle de cada proyecto.
   4) Pone el año actual en el pie de página.

   NO necesitas tocar este archivo para añadir proyectos:
   todo se hace desde el HTML de cada página.
   ============================================================= */
(function () {
  'use strict';

  /* =========================================================
     1 · MENÚ MÓVIL
     ========================================================= */
  var botonMenu = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu-principal');

  if (botonMenu && menu) {
    botonMenu.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      botonMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    /* Al pulsar un enlace del menú, se cierra */
    menu.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        menu.classList.remove('abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     2 · FILTROS DE PROYECTOS
     Cada grupo .filtros controla la .grid-proyectos que tiene
     al lado. Las tarjetas se muestran u ocultan según su
     atributo data-categoria.
     ========================================================= */
  document.querySelectorAll('.filtros').forEach(function (grupo) {
    var contenedor = grupo.parentElement;
    var grid = contenedor.querySelector('.grid-proyectos');
    var vacio = contenedor.querySelector('.grid-vacio');

    if (!grid) { return; }

    var tarjetas = grid.querySelectorAll('.tarjeta');

    grupo.addEventListener('click', function (evento) {
      var boton = evento.target.closest('.filtro');
      if (!boton) { return; }

      var filtro = boton.getAttribute('data-filtro');

      /* Marcar el botón activo */
      grupo.querySelectorAll('.filtro').forEach(function (b) {
        b.classList.remove('activo');
      });
      boton.classList.add('activo');

      /* Mostrar/ocultar tarjetas */
      var visibles = 0;
      tarjetas.forEach(function (tarjeta) {
        var categoria = tarjeta.getAttribute('data-categoria');
        var mostrar = (filtro === 'todos' || categoria === filtro);
        tarjeta.classList.toggle('oculta', !mostrar);
        if (mostrar) { visibles++; }
      });

      /* Mensaje si no hay resultados */
      if (vacio) {
        vacio.hidden = visibles > 0;
      }
    });
  });

  /* =========================================================
     3 · POP-UP DE DETALLE
     El contenido se toma de la propia tarjeta:
       · .tarjeta-media     -> imagen principal
       · .tarjeta-titulo    -> título
       · data-categoria-nombre -> categoría
       · .tarjeta-detalle   -> texto largo, galería y video
     ========================================================= */
  var modal = document.getElementById('modal');
  var modalMedia = document.getElementById('modal-media');
  var modalCat = document.getElementById('modal-cat');
  var modalTitulo = document.getElementById('modal-titulo');
  var modalDetalle = document.getElementById('modal-detalle');

  var ultimoFoco = null;

  function abrirModal(tarjeta) {
    if (!modal) { return; }

    ultimoFoco = document.activeElement;

    /* Categoría: primero el nombre visible, si no el atributo */
    var cat = tarjeta.getAttribute('data-categoria-nombre');
    if (!cat) {
      var catEl = tarjeta.querySelector('.tarjeta-cat');
      cat = catEl ? catEl.textContent.trim() : '';
    }

    var tituloEl = tarjeta.querySelector('.tarjeta-titulo');
    var mediaEl = tarjeta.querySelector('.tarjeta-media');
    var detalleEl = tarjeta.querySelector('.tarjeta-detalle');

    if (modalCat) { modalCat.textContent = cat; }
    if (modalTitulo) { modalTitulo.textContent = tituloEl ? tituloEl.textContent.trim() : ''; }
    if (modalMedia) { modalMedia.innerHTML = mediaEl ? mediaEl.innerHTML : ''; }
    if (modalDetalle) { modalDetalle.innerHTML = detalleEl ? detalleEl.innerHTML : ''; }

    /* Volver el scroll del pop-up al principio */
    if (modalMedia) { modalMedia.scrollTop = 0; }
    if (modalDetalle) { modalDetalle.scrollTop = 0; }

    modal.hidden = false;
    document.body.classList.add('sin-scroll');

    var cerrar = modal.querySelector('.modal-cerrar');
    if (cerrar) { cerrar.focus(); }
  }

  function cerrarModal() {
    if (!modal || modal.hidden) { return; }

    modal.hidden = true;
    document.body.classList.remove('sin-scroll');

    /* Devolver el foco a la tarjeta desde la que se abrió */
    if (ultimoFoco && ultimoFoco.focus) { ultimoFoco.focus(); }
  }

  /* Abrir al pulsar cualquier tarjeta */
  document.querySelectorAll('.tarjeta-boton').forEach(function (boton) {
    boton.addEventListener('click', function () {
      abrirModal(boton.closest('.tarjeta'));
    });
  });

  if (modal) {
    /* Cerrar con la X o con el fondo */
    modal.querySelectorAll('[data-cerrar]').forEach(function (el) {
      el.addEventListener('click', cerrarModal);
    });

    /* Cerrar con la tecla Escape */
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') { cerrarModal(); }
    });
  }

  /* =========================================================
     4 · AÑO AUTOMÁTICO EN EL PIE
     ========================================================= */
  var anio = document.getElementById('anio');
  if (anio) { anio.textContent = new Date().getFullYear(); }

})();
