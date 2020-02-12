const apiKey = 'AIzaSyD7qsEKQn5Ypfu4eo5LvYSVLjpVPvzjctE'
const projectId='miproy-5a5a0'
const collection = 'foro'

var foros = []
var foroActivoId = null
// Tiene que ser strings por lo que rodealos de comillas

// Ej.
// const apiKey = 'AIzaSyBRGN59vjaQmoyDZWq93oTQbVQlCgVRUsQ'
// const projectId = 'bedu-baas'
// const collection = 'users'

firebase.initializeApp({
  apiKey,
  projectId
});

var db = firebase.firestore();


db.collection(collection).get().then((forosQuery) => {

var listaForos = document.getElementById('lista-foros')

forosQuery.forEach((foro) => {
  foros.push(foro)

  // agregar un boton con texto = nombre de foro
  var botonForo = document.createElement('div')
  botonForo.innerHTML = `
    <button onclick="cambiaForo('${foro.id}')">${foro.data().nombre}</button>
    `
    listaForos.append(botonForo)
    
  });
});
  
function cambiaForo (foroId) {
    
    let foro = foros.find(f => f.id === foroId)
    foroActivoId = foro.id
    // console.log(foro.data())
    document.getElementById('titulo-foro').innerText = foro.data().nombre
    cargaMensajes(foroId)
  // obtiene todos los mensajes del foro cuyo id es igual a idForo
}

function cargaMensajes (foroId) {

  var mensajes = document.getElementById('mensajes')

  mensajes.innerHTML = ''
  db.collection('mensajes')
    .where('foroId','==',foroId)
    .get()
    .then((msgQuery) => {

      msgQuery.forEach(mensaje => {
        var mensajeDiv = document.createElement('div')
        mensajeDiv.innerHTML = `
          <p>${mensaje.data().texto}</p>
          `
        mensajes.append(mensajeDiv)          

      })
    })

  let mandaMensajes = document.createElement('div')
  let input = document.createElement('input')
  input.id = 'input-mensaje'
  let boton = document.createElement('button')
  boton.innerText = 'Manda'
  boton.onclick = mandaMensaje
  mandaMensajes.appendChild(input)
  mandaMensajes.appendChild(boton)
  mensajes.append(mandaMensajes)
  // collectionGetMensajes
}

function mandaMensaje () {
  let texto = document.getElementById('input-mensaje').value
  console.log('holaaaa')
  // lee de el texto de input
  db.collection("mensajes").doc().set({
    texto,
    foroId: foroActivoId
  })
  .then(function() {
      console.log("Document successfully written!");
      var mensajes = document.getElementById('mensajes')
      var mensajeDiv = document.createElement('div')
      mensajeDiv.innerHTML = `
        <p>${texto}</p>
        `
      mensajes.append(mensajeDiv)
      document.getElementById('input-mensaje').value = ''

  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
  // agrega mensaje con texto y foroId = foro activo
}