
const cardsHouse = document.getElementById('cardsHouse');
//Se consume la api
let p = true; 
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        renderCards(data)
        if(p){
          renderType(data)
          renderStatus(data)
          p=false
        } 
        statusOpt.value = statusOpt.value;
    } catch (error) {
        console.log(error)
    }
}

//Se recortan las 6 primeras cards consumidas anteriormente
const initialHouses = (data, value) =>{
  const initialData = data.slice(0, value)
  return initialData;
}
//Función para renderizar las cards
const renderCards = (data) =>{
  //se escucha el botón para mostrar o no todas las cards
    const initialData = filterCards(data) 
    const value = properties ? initialData.length:6;
    const finalData = initialHouses(initialData, value)
  //Se renderizan todas las cards elegidas
    cardsHouse.innerHTML = ""
    finalData.forEach((element, index) => {
        cardsHouse.innerHTML += `
        <figure class="card radius" id="${index}">
            <section id="openModal" class="img_house" data-url="${element.houseImg}">
              <div class="labels_cards">
                <h3 class="label_blue radius">${element.type.toUpperCase()}</h3>
                <h3 class="label_orange radius">FOR SALE</h3>
              </div>
              <div class="price radius">
                <h4>$${element.price}</h4>
              </div>
            </section>
            <section class="info">
              <h3>${element.city}</h3>
              <h2>${element.location[0]} <br>${element.location[1]}</h2>
              <article class="info-user">
                <div>
                  <img src="${element.userImg}" alt="">
                  <h4>${element.userName}</h4>
                </div>
                <p>${element.timeAgo}</p>
              </article>
              <article>
                <section>
                <img src="./img/areaicon.svg" alt="">
                <h4><span>${element.size} </span>Sq Ft</h4>
                </section>
                <div>
                  <div><img src="./img/garageicon.svg" alt=""> <p>${element.garage}</p></div>
                  <div><img src="./img/bathroomicon.svg" alt=""> <p>${element.bethroom}</p></div>
                  <div><img src="./img/bedroomicon.svg" alt=""> <p>${element.bedroom}</p></div>
                </div>
              </article>
            </section>
          </figure>
        `
    });
    //Modal
    if (cardModal !== -1){
   renderModal(finalData, cardModal);
   const cardFigure = document.getElementById('figureCardModal');
   console.log(cardFigure)
   cardFigure.classList.add('animate__fadeInUp')
   cardFigure.classList.remove('animate__fadeOutUp')
  }
  //lazy loading
  const cards = document.querySelectorAll('.img_house')
  const callback = (entries, observer) =>
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.background = `url(${entry.target.dataset.url})`;
      entry.target.style.backgroundSize = 'cover'
      observer.unobserve(entry.target);
    }
  });
  let observer = new IntersectionObserver(callback, {rootMargin: "100px 100% 200px 100%"})
cards.forEach((card)=>{
  observer.observe(card)
})

//
}

const modal = document.getElementById('modal')
let cardModal = -1;

modal.style.display = 'none';
cardsHouse.addEventListener('click', (e) =>{
  if (e.path[0].id == "openModal"){
  modal.style.display = "block" 
  cardModal = e.path[1].id;
  modal.classList.add('animate__fadeIn')
  fetchData();
  } 
})
modal.addEventListener('click', (e)=>{
  e.path[2].classList.remove('animate__fadeOut')
  e.path[3].classList.remove('animate__fadeOutUp')
  if(e.path[0].id == 'close-modal'){
    e.path[3].classList.remove('animate__fadeInUp')
    e.path[2].classList.remove('animate__fadeIn')
    //
    e.path[2].classList.add('animate__animated')
    e.path[3].classList.add('animate__fadeOutUp')
    setTimeout(()=>{
      modal.style.display = "none";
    },800)
  } 
})
const renderModal = (data, cardModal) =>{
 return modal.innerHTML =`
  <figure class="card radius card-modal animate__animated" id="figureCardModal">
  <section class="img_modal" style="background: url(${data[cardModal].houseImg});">
    <div class="labels_cards">
    <button id="close-modal">x</button>
    </div>
  </section>
  <div class="modal-contend">
  <section class="info info-modal">
    <h3>${data[cardModal].city}</h3>
    <h2>${data[cardModal].location[0]} <br>${data[cardModal].location[1]}</h2>
    <article class="info-user modal-user">
      <div>
        <img src="${data[cardModal].userImg}" alt="">
        <h4>${data[cardModal].userName}</h4>
      </div>
      <p>${data[cardModal].timeAgo}</p>
    </article>
    <article>
      <section class="size">
      <img src="./img/areaicon.svg" alt="" >
      <h4><span>${data[cardModal].size} </span>Sq Ft</h4>
      </section>
      <div class="house-info">
        <div><img src="./img/garageicon.svg" alt=""> <p>${data[cardModal].garage}</p></div>
        <div><img src="./img/bathroomicon.svg" alt=""> <p>${data[cardModal].bethroom}</p></div>
        <div><img src="./img/bedroomicon.svg" alt=""> <p>${data[cardModal].bedroom}</p></div>
      </div>
    </article>
  </section>
  <div class="price-modal radius">
    <p class="type-modal">${data[cardModal].type}</p>
    <h4>FOR SALE <br> $${data[cardModal].price}</h4>
  </div>
  </div>
</figure>
  `
}
//escucha del boton para poner las propiedades
const allProperties = document.getElementById('allProperties');
let properties = false;
allProperties.addEventListener('click', () =>{
  properties = !properties
  fetchData()
  properties ? allProperties.innerText = "LESS PROPERTIES" : allProperties.innerText = "ALL PROPERTIES"
})
//
const typeOpt = document.getElementById('type');
const renderType = (data) =>{
  typeOpt.innerHTML = ""
  typeOpt.innerHTML = `<option value="1">Select type</option>`;
  const elements = [data[0].type]
  data.forEach(element =>{
    let statusTrue = true;
    elements.find(e =>{
        if(e == element.type){
          statusTrue = false;
        }
      }) 
    if(statusTrue){
      elements.push(element.type)
    }
  })
  elements.forEach(e=>{
    typeOpt.innerHTML += `
    <option value="${e}">${e}</option>
    `;
  })
}
//Se leen todas las propiedades de cuidades recibidas en la api y se convierten en opciones del status
const statusOpt = document.getElementById('status');
const renderStatus = (data) =>{
  statusOpt.innerHTML = ""
  statusOpt.innerHTML = `<option value="1">Select Status</option>`;
  const elements = [data[0].city]
  data.forEach(element =>{
    let statusTrue = true;
    elements.find(e =>{
        if(e == element.city){
          statusTrue = false;
        }
      }) 
    if(statusTrue){
      elements.push(element.city)
    }
  })
  elements.forEach(e=>{
    statusOpt.innerHTML += `
    <option value="${e}">${e}</option>
    `;
  })
}
//
const inputText = document.getElementById('inputText');
const keysAndValue = (data, key) =>{
  if(inputText.value.includes(data[key]) && inputText.value.includes(key)){ 
    return inputText.value.includes(data[key])
 }else{
  return data[key].includes(inputText.value)
 }
}
const searchValue = (data) => {
  return Object.keys(data).some(key => keysAndValue(data, key) )
  }



const filterCards = (data) =>{
  console.log([statusOpt.value, typeOpt.value, inputText.value])
 //sin filtro
 if((statusOpt.value === "1" || statusOpt.value === "") && (typeOpt.value === "" || typeOpt.value === "1") && inputText.value === ""){
  return data
    }else{
      if(typeOpt.value === "1" && statusOpt.value === "1"  && inputText.value !== ""){
        return data.filter(searchValue)
      }else{
 //filtro desde el type
      if(statusOpt.value == "" || statusOpt.value == "1" && typeOpt.value !== "1" && inputText.value == ""){
        return data.filter(element => element.type == typeOpt.value )
      }else{   
//filtro desde el type y el search
        if((statusOpt.value == "" || statusOpt.value == "1") && typeOpt.value !== "1" && inputText.value !== ""){
          console.log("Second filter")
          const firstFilter = data.filter(element => element.type == typeOpt.value );
          return firstFilter.filter(searchValue)
        }else{ 
//filtro desde el status
        if((typeOpt.value == "" || typeOpt.value == "1") && statusOpt.value !== "1" && inputText.value == ""){
          console.log("second filter")
          return data.filter(element => element.city == statusOpt.value)
        }else{
//filtro desde el status y el search
          if((typeOpt.value == "" || typeOpt.value == "1")&& statusOpt.value !== "1" && inputText.value !== ""){
            const firstFilter = data.filter(element => element.city == statusOpt.value );
            return firstFilter.filter(searchValue)
          }else{
            if(typeOpt.value !== "1"&& statusOpt.value !== "1" && inputText.value == ""){
              const firstFilter = data.filter(element => element.type == typeOpt.value )
              return firstFilter.filter(element => element.city == statusOpt.value )
            }else{
              const firstFilter = data.filter(element => element.type == typeOpt.value )
              const lastFilter = firstFilter.filter(element => element.city == statusOpt.value )
              return lastFilter.filter(searchValue)
              }
            }
          }
        }
      }
    }
  }
}

const buttonFind = document.getElementById('find');
buttonFind.addEventListener('click', ()=>{
    fetchData()
  })
  
statusOpt.addEventListener('change',() =>{
  fetchData()
})
typeOpt.addEventListener('change',() =>{
  fetchData()
})

const fetchAgents = async () =>{
  try{
    const res = await fetch('agentsApi.json')
    const data = await res.json()
    renderAgents(data)
  }catch(error){
    console.log(error)
  }
}
fetchAgents()
const agents = document.getElementById('agents');
const filterAgents = (data, value1, value2) =>{
  return data.slice(value1, value2)
}
let value1 = 0;
let value2 = 3;
const renderAgents = (data) =>{
  const filterData = filterAgents(data, value1, value2);
  console.log(filterData)
  setTimeout(()=>{
    agents.innerHTML = ""
    filterData.forEach((agent)=>{
      agents.innerHTML += `
          <div>
              <img src="${agent.userImg}" alt="">
              <h4>Real Estate Broker</h4>
              <h1>${agent.name}</h1>
              <p>123 456 7890</p>
              <p>agent@gmail.com</p>
            </div>
      `
    })
  },0)
}

const navigation = document.getElementById('navigation')

navigation.addEventListener('click', (ev)=>{
  if(ev.path[0].name == "radio"){
    agents.classList.add("animate__animated")
    
    if(ev.path[0].value == "2"){
      if(value1 < 3){
        agents.classList.add("animate__fadeInRight")
      }else{
        agents.classList.add("animate__fadeInLeft")
      }
      value1 = 3
      value2 = 6
      fetchAgents()
    }else{
      if(ev.path[0].value == "3"){
        if(value1 < 6){
          agents.classList.add("animate__fadeInRight")
        }else{
          agents.classList.add("animate__fadeInLeft")
        }
        value1 = 6
        value2 = 9
        fetchAgents()
      }else{
        if(value1 > 0){
          agents.classList.add("animate__fadeInLeft")
        }else{
          agents.classList.add("animate__fadeInRight")
        }
        value1 = 0
        value2 = 3
        fetchAgents()
      }
    }
    setTimeout(() =>{
      agents.classList.remove("animate__fadeInRight")
      agents.classList.remove("animate__fadeInLeft")
    },1000)
  }
})

const btnMenu = document.getElementById('btnMenu')
const menu = document.getElementById('menu');
btnMenu.addEventListener('click', ()=>{
  
   menu.classList.toggle('hidden')
   menu.classList.add('animate__slideInDown')
})

document.addEventListener('DOMContentLoaded', fetchData())
