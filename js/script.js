class Api {
  constructor(url, headers) {
     this._url = url;
     this._headers = headers;
  }

  getItems() {
     return fetch(this._url, {
        method: 'GET',
        headers: this._headers
     }).then((res) => {
        return this._processResult(res, 'Ошибка при получении данных');
     });
  }

  deleteItem(id) {
     return fetch(`${this._url}/${id}`, {
        method: 'DELETE',
        headers: this._headers
     }).then((res) => {
        return this._processResult(res, 'Ошибка при удалении записи');
     });
  }

  createItem(data) {
     return fetch(`${this._url}/`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(data)
     }).then((res) => {
        return this._processResult(res, 'Ошибка при добавлении записи');
     });
  }

  updateItem(id, data) {
     return fetch(`${this._url}/${id}`, {
        method: 'PUT',
        headers: this._headers,
        body: JSON.stringify(data)
     }).then((res) => {
        return this._processResult(res, 'Ошибка при изменении записи');
     });
  }

  _processResult(res, errorText) {
     if (res.ok) {
        return res.json();
     }
     alert(errorText);
     return Promise.reject(errorText);
  }
}
class Form {
  constructor(element) {
     this._element = element;
  }

  init(submitHandler, values) {
     this.closeForm();
     this._submitHandler = submitHandler;
     this._element.addEventListener('submit', this._submitHandler);

     if (values) {
        Object.keys(values).forEach((name) => {
           this._element.querySelector(`[name=${name}]`).value = values[name];
        });
     }
  }

  closeForm() {
     this._element.reset();
     this._element.removeEventListener('submit', this._submitHandler);
     this._submitHandler = null;
  }
}

const $peopleSection = document.querySelector('.people');
const $personTemplate = document.querySelector('.person-template').content;
const $popup = document.querySelector('#personPopup');
const $personButton = document.querySelector('.person-image');
const $popupCloseButton = document.querySelector('.popup-close');
const personApi = new Api('http://localhost:5500', { 'Content-Type': 'application/json' });
const personForm = new Form(document.querySelector('.person-form'));

const showPopup = () => {
   $popup.classList.add('opened');
}

const hidePopup = () => {
   $popup.classList.remove('opened');
   $personForm.closeForm();
}

const renderList = (data) => {
   $kittiesSection.innerHTML = '';
   data.forEach(renderItem)
};

const renderItem = (item) => {
   const $personEl = $personTemplate.cloneNode(true);
   const $personImg = $personEl.querySelector('.person-image');
   const $buttonDelete = $personEl.querySelector('.button-delete');
   const $buttonEdit = $personEl.querySelector('.button-edit');

   $personEl.querySelector('.person-name').textContent = item.name;
   $personEl.querySelector('.person-info').textContent = item.about;
   $personImg.setAttribute('src', item.avatarUrl);
   $personImg.setAttribute('alt', item.name);

   $kittiesSection.appendChild($personEl);

   $buttonDelete.addEventListener('click', (event) => {
      event.preventDefault();

      personApi.deleteItem(item.id).then(() => {
         event.target.closest('.person')?.remove?.();
      });
   });

   $buttonEdit.addEventListener('click', (event) => {
      showPopup();
      personForm.init((event) => {
         event.preventDefault();
         const data = {
            id: item.id,
            name: event.target.elements[0].value,
            about: event.target.elements[1].value,
            avatarUrl: event.target.elements[2].value
         };

         personApi.updateItem(item.id, data).then(() => {
            personApi.getItems().then((data) => renderList(data));
            hidePopup();
         });
      }, {
         name: item.name,
         about: item.about,
         url: item.avatarUrl
      });
   });
}


personApi.getItems().then((data) => renderList(data));

$personButton.addEventListener('click', () => {
   showPopup();
   personForm.init((event) => {
      event.preventDefault();
      const data = {
         name: event.target.elements[0].value,
         about: event.target.elements[1].value,
         avatarUrl: event.target.elements[2].value
      };

      personApi.createItem(data).then(() => {
         personApi.getItems().then((data) => renderList(data));
         hidePopup();
      });
   });
});

$popupCloseButton.addEventListener('click', () => {
   hidePopup();
});