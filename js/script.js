class Api {
  constructor(url, headers) {
     this.url = url;
     this.headers = headers;
  }

  getItems() {
     return fetch(this.url, {
        method: 'GET',
        headers: this.headers
     }).then((res) => {
        return this.processResult(res, 'Ошибка при получении данных');
     });
  }

  deleteItem(id) {
     return fetch(`${this.url}/${id}`, {
        method: 'DELETE',
        headers: this.headers
     }).then((res) => {
        return this.processResult(res, 'Ошибка при удалении записи');
     });
  }

  createItem(data) {
     return fetch(`${this.url}/`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
     }).then((res) => {
        return this.processResult(res, 'Ошибка при добавлении записи');
     });
  }

  updateItem(id, data) {
     return fetch(`${this.url}/${id}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data)
     }).then((res) => {
        return this.processResult(res, 'Ошибка при изменении записи');
     });
  }

  processResult(res, errorText) {
     if (res.ok) {
        return res.json();
     }
     alert(errorText);
     return Promise.reject(errorText);
  }
}
class Form {
  constructor(element) {
     this.element = element;
  }

  init(submitHandler, values) {
     this.closeForm();
     this.submitHandler = submitHandler;
     this.element.addEventListener('submit', this.submitHandler);

     if (values) {
        Object.keys(values).forEach((name) => {
           this.element.querySelector(`[name=${name}]`).value = values[name];
        });
     }
  }

  closeForm() {
     this.element.reset();
     this.element.removeEventListener('submit', this.submitHandler);
     this.submitHandler = null;
  }
}

const peopleSection = document.querySelector('.people');
const personTemplate = document.querySelector('.person-template').content;
const createPersonButton = document.querySelector('#button-add-desktop');
const createPersonButton2 = document.querySelector('#button-add-mobile');


const personApi = new Api('http://localhost:5000', { 'Content-Type': 'application/json' });
const personForm = new Form(document.querySelector('.person-form'));

function showPopup(popup){  
   var curModal;
    curModal = popup;
    $(".modal").each(function() {
      if (this !== curModal) {
        $(this).modal('hide')
      }
    });
   popup.modal('show');
   
}

function hidePopup(popup){
   popup.modal('hide')
   if (popup == $('#person-change'))
     personForm.closeForm();
}

const renderList = (data) => {
   peopleSection.innerHTML = '';
   data.forEach(renderItem)
};

const renderItem = (item) => {
   var clicked = false;
   const personEl = personTemplate.cloneNode(true);
   const personImg = personEl.querySelector('.person-image');
   const buttonDelete = personEl.querySelector('.button-delete');
   
   const buttonCard = personEl.querySelector('.name');

   personEl.querySelector('.first-name').innerHTML = item["first-name"];
   personEl.querySelector('.last-name').innerHTML = item["last-name"];
   personEl.querySelector('.study').innerHTML = item.study;
   personEl.querySelector('.course').innerHTML = item.course + " курс";
   personEl.querySelector('.city').innerHTML = "г. " + item.city;
   personImg.setAttribute('src', item.url);
   

   peopleSection.appendChild(personEl);

   buttonDelete.addEventListener('click', (event) => {
      event.preventDefault();

      personApi.deleteItem(item.id).then(() => {
         event.target.closest('.person')?.remove?.();
      });
   });
   

   buttonCard.addEventListener('click', () => {
      
      const personEl = document.querySelector('.person-card');
      showPopup($('#person-popup'));
      personEl.querySelector('.first-name').innerHTML = item["first-name"];
      personEl.querySelector('.last-name').innerHTML = item["last-name"];
      personEl.querySelector('.middle-name').innerHTML = item["middle-name"];
      personEl.querySelector('.study').innerHTML = item.study;
      personEl.querySelector('.course').innerHTML = item.course + " курс";
      personEl.querySelector('.city').innerHTML = item.city;
      personEl.querySelector('.phone').innerHTML = item.phone;
      personEl.querySelector('.mail').innerHTML = item.mail;
      personEl.querySelector('.image').setAttribute('src', item.url);
      personEl.querySelector('.vk-link').setAttribute('href', item.vk);
      personEl.querySelector('.whatsapp-link').setAttribute('href', item.whatsapp);
      personEl.querySelector('.facebook-link').setAttribute('href', item.facebook);
      personEl.querySelector('.telegram-link').setAttribute('href', item.telegram);
      const buttonEdit = personEl.querySelector('.button-edit');

   buttonEdit.addEventListener('click', (event) => {
      clicked = true;
     $('#person-popup').on('hidden.bs.modal', function () {
      if (clicked)
         showPopup($('#person-change'));
         clicked = false;
    })
    hidePopup($('#person-popup'));
      personForm.init((event) => {
         event.preventDefault();
         const data = {
            id: item.id,
            "last-name": event.target.elements[0].value,
            "first-name": event.target.elements[1].value,
            "middle-name": event.target.elements[2].value,
            phone: event.target.elements[3].value,
            mail: event.target.elements[4].value,
            study: event.target.elements[5].value,
            course: event.target.elements[6].value,
            city: event.target.elements[7].value,
            url: event.target.elements[8].value,
            vk: event.target.elements[9].value,
            facebook: event.target.elements[10].value,
            whatsapp: event.target.elements[11].value,
            telegram: event.target.elements[12].value
         };

         personApi.updateItem(item.id, data).then(() => {
            personApi.getItems().then((data) => renderList(data));
            hidePopup($('#person-change'));
         });
      }, {
         "last-name": item["last-name"],
         "first-name": item["first-name"],
         "middle-name": item["middle-name"],
         phone: item.phone,
         mail: item.mail,
         study: item.study,
         course: item.course,
         city: item.city,
         url: item.url,
         vk: item.vk,
         facebook: item.facebook,
         whatsapp: item.whatsapp,
         telegram: item.telegram
      });
      
   });
   });

}
function create() {
   showPopup($('#person-change'));
   personForm.init((event) => {
      event.preventDefault();
      const data = {
         "last-name": event.target.elements[0].value,
            "first-name": event.target.elements[1].value,
            "middle-name": event.target.elements[2].value,
            phone: event.target.elements[3].value,
            mail: event.target.elements[4].value,
            study: event.target.elements[5].value,
            course: event.target.elements[6].value,
            city: event.target.elements[7].value,
            url: event.target.elements[8].value,
            vk: event.target.elements[9].value,
            facebook: event.target.elements[10].value,
            whatsapp: event.target.elements[11].value,
            telegram: event.target.elements[12].value
      };

      personApi.createItem(data).then(() => {
         personApi.getItems().then((data) => renderList(data));
         hidePopup($('#person-change'));
      });
   });
}

personApi.getItems().then((data) => {renderList(data)});

createPersonButton.addEventListener('click', create);
createPersonButton2.addEventListener('click', create);
