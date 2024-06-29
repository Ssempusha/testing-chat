let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
/* const cat = new Image(); */
/* cat.src = './img/5eXXf4mf6iE.jpg' */
/* console.log(cat) */
/* window.addEventListener('DOMContentLoaded', () => { */

    const expertName = document.querySelector(".expert_name");
    const expertNamePlace = document.querySelector(".expert_name-place");
    const expertBlock = document.querySelector("#expert_block");
    const chatImgUser = document.querySelector(".img_user");
    const otherMessage = document.querySelector(".other_message");
    const messageForm = document.querySelector(".footer_form");

    function animateBlock(image) {
        let block = document.getElementById('expert_block');
        let img = document.createElement('img');
        let div = document.createElement('div');
        img.setAttribute('src', `data:image/png;base64,${image}`);
        div.classList.add('img_expert-wrap')
        div.insertAdjacentElement('afterbegin', img)
        img.classList.add('expert_img')
        block.insertAdjacentElement('afterbegin', div)
        block.classList.add('show-block');
    }

    // функция для генерации UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

    //функции для работы с куками
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
      }
      
      function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
      }
      
      function getUserIdFromCookie() {
        return getCookie("user_id");
      }

     /*  function getUserHistory(userId) {
        const url = 'https://aifounds.xyz/api/get_history';
        const body = {
            user_id: userId
        };
        try {
            const response = fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
    
            if (response.ok) {
                const data = response.json();
                if (data.message === "True") {
                    console.log('История взаимодействий пользователя:', data.response_history);
                    return data.response_history;
                } else {
                    console.log('Неожиданный ответ:', data);
                }
            } else if (response.status === 404) {
                console.error('Ошибка 404: Пользователь не найден. Создайте его сначала.');
            } else if (response.status === 500) {
                console.error('Ошибка 500: Внутренняя ошибка сервера.');
            } else {
                console.error('Неожиданный статус ответа:', response.status);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }
 */

      async function createUserFetch() {
        let userId = getUserIdFromCookie();
        if (!userId) {
          userId = generateUUID();
          setCookie("user_id", userId, 365); // Сохраняем куку на 1 год
        }
      console.log(userId);
        const url = "https://aifounds.xyz/api/create_user";
        const payload = { user_id: userId };
      
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log("Response from create_user:", data);
            return data;
          } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error during fetch:", error);
          throw error;
        }
      }

    const promise = new Promise((resolve) => {

        setTimeout(() => {
            document.querySelector('.spinner-text').innerHTML = `Специалист найден. Подключение...`
        }, 1500)
        setTimeout(() => {
            document.querySelector('.loader-container').classList.add("hidden");
            resolve()
        }, 25)
    })

    /* const promise2 = new Promise((resolve) => {
        //здесь запрос на сервер
        fetch(`https://jsonplaceholder.typicode.com/photos/${Math.floor(Math.random() * 1000)}`)
            .then(response => response.json())
            .then(response => resolve(response))

    }) */
           
    
    function animateTyping(message, initialMessage = null) { // Add optional initialMessage parameter
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                document.querySelector('.footer').style.opacity = '1';
                document.querySelector('.message_wrapper').classList.add('show');
                resolve();
            }, 2000);
        });
        /* promise.then(() => {
            setTimeout(() => {
                createLoadingText('.chat_message-window ');
            }, 1000);
        }); */
        promise.then(() => {
            /* setTimeout(() => { */
                otherMessage.children[0].children[0].innerHTML = initialMessage ? initialMessage : `${message}`; // Use initialMessage if provided
                document.querySelector('.form_textarea').removeAttribute('disabled');
            /* }, 4000); */
        });
    }
    

    promise.then(() => {
        createUserFetch()
            .then((data) => {
                animateBlock(data.image);
                expertName.textContent = data.assistant_name;
                return data;
            })
            .then((data) => {
                animateTyping(data.message.charAt(0).toUpperCase() + data.message.slice(1)/* , "Здравствуйте! Я ваш специалист :)" */);
                setTimeout(() => {
                    moveToMessage(document.querySelector('.expert_img'), chatImgUser);
                }, 2000);
            })
            .then(() => {
                setTimeout(() => {
                    moveToChatHeader(expertName, expertNamePlace);
                }, 1500);
            });
    });

    function moveToChatHeader(picture, cart) {
        let picture_pos = picture.getBoundingClientRect();
        let cart_pos = cart.getBoundingClientRect();
        setTimeout(() => {
            picture.style.position = "fixed";
            picture.style.left = picture_pos['x'] + "px";
            picture.style.top = picture_pos['y'] + "px";
            picture.style.zIndex = 32767;
            picture.style.color = '#fff'
            picture.style.backgroundColor = 'rgb(167 107 212 / 90%)';
            picture.style.padding = '5px 8px';
            picture.style.borderRadius = '25px'
            let start_x = picture_pos['x'] - 0.1 * picture_pos['width'];
            let start_y = picture_pos['y'] + 0.35 * picture_pos['height'];

            let delta_x = (cart_pos['x'] + 0.5 * cart_pos['width']) - start_x;
            let delta_y = (cart_pos['y'] + 0.5 * cart_pos['height']) - start_y;

            document.body.appendChild(picture);
            void picture.offsetWidth;
            picture.style.transform = "translateX(" + delta_x + "px)";
            picture.style.transform += "translateY(" + delta_y + "px)";
            picture.style.transition = "1s";
            picture.style.color = '#fff'
            picture.style.backgroundColor = 'rgb(167 107 212 / 90%)';
            picture.style.padding = '5px 8px';
            picture.style.borderRadius = '25px'
            picture.style.fontSize = '14px'
        }, 1000)

        document.querySelector('.expert_title').classList.add('hidden');
        document.querySelector('.show-block').classList.add('hidden');
        setTimeout(() => {
            expertNamePlace.appendChild(picture);
            picture.style.position = "static";
            picture.style.color = '#fff';
            picture.style.fontSize = '14px'
        }, 2000)

    }
    function moveToMessage(picture, cart) {
        let picture_pos = picture.getBoundingClientRect();
        let cart_pos = cart.getBoundingClientRect();

        picture.style.position = "fixed";
        picture.style.left = picture_pos['x'] + "px";
        picture.style.top = picture_pos['y'] + "px";
        picture.style.zIndex = 32767;

        let start_x = picture_pos['x'] + 0.5 * picture_pos['width'];
        let start_y = picture_pos['y'] + 0.5 * picture_pos['height'];

        let delta_x = (cart_pos['x'] + 0.5 * cart_pos['width']) - start_x;
        let delta_y = (cart_pos['y'] + 0.5 * cart_pos['height']) - start_y;

        document.body.appendChild(picture);

        void picture.offsetWidth;
        picture.style.transform = "translateX(" + delta_x + "px)";
        picture.style.transform += "translateY(" + delta_y + "px)";
        picture.style.transform += "scale(0.25)";
        picture.style.transition = "1s";


        setTimeout(() => {
            document.querySelector('.img_user').appendChild(picture);
            picture.style.position = "static";
            picture.style.transform = 'none';
        
            function updateImageStyles() {
                if (window.innerWidth > 380) {
                    picture.style.width = '50px';
                    picture.style.height = '50px';
                    document.querySelector('.expert_img').style.width = '50px';
                    document.querySelector('.expert_img').style.height = '50px';
                } else {
                    picture.style.width = '40px';
                    picture.style.height = '40px';
                    document.querySelector('.expert_img').style.width = '40px';
                    document.querySelector('.expert_img').style.height = '40px';
                }
            }
        
            // Вызываем функцию сразу после загрузки страницы
            window.addEventListener('DOMContentLoaded', updateImageStyles);
        
            // Добавляем обработчик события resize
            window.addEventListener('resize', updateImageStyles);
        
            picture.style.display = 'block';
            picture.style.padding = '0';
        }, 1000)
    }

let lastMessageTime = 0;
let messageBuffer = '';
let timeoutId;

console.log(messageBuffer);
console.log(lastMessageTime);
    function addMessage(text, type) {
        let div = document.createElement('div');
        let p = document.createElement('div')
        p.classList.add('chat_typing')
        if (!type) {
            return
        }
        if (type === 'my_message') {
            div.classList.add('test_box');
            div.classList.add('message');
            div.classList.add('my_message');
            div.classList.add('right');
            div.appendChild(p)
            p.textContent = text;
            document.querySelector('.chat_message-window').insertAdjacentElement('afterbegin', div);
        } else if (type === 'other_message') {

            const testBoxDiv = document.createElement('div');//текст сообщения

            const messageWrapper = document.createElement('div');//обертка всего сообщения
            messageWrapper.classList.add('message_wrapper','show');
            testBoxDiv.classList.add('test_box', 'message', 'other_message','left');
            let firstExpertImg = document.querySelector('.expert_img');

            // Создаем первый дочерний div с классом "img_user"
            const imgUserDiv = document.createElement('div');//div с изображением
            imgUserDiv.classList.add('img_user');
            messageWrapper.appendChild(imgUserDiv);
            const expertImg = document.createElement('img');
            expertImg.classList.add('expert_img');
            function updateImageStyles() {
                if (window.innerWidth > 380) {
            expertImg.style.width = '50px'
            expertImg.style.height = '50px'
                } else {
            expertImg.style.width = '40px'
            expertImg.style.height = '40px'
                }
            }
            // Вызываем функцию сразу после загрузки страницы
            window.addEventListener('DOMContentLoaded', updateImageStyles);
        
            // Добавляем обработчик события resize
            window.addEventListener('resize', updateImageStyles);

            // устанавлтваем атрибут из изображения полученного с бэка 
            expertImg.setAttribute('src', firstExpertImg.getAttribute('src'));
            imgUserDiv.appendChild(expertImg);
            messageWrapper.appendChild(testBoxDiv)

            // Создаем второй дочерний div с классом "chat_typing"
            const chatTypingDiv = document.createElement('div');
            chatTypingDiv.classList.add('chat_typing');
            testBoxDiv.appendChild(chatTypingDiv);
            chatTypingDiv.textContent = text;
            document.querySelector('.chat_message-window').insertAdjacentElement('afterbegin', messageWrapper);
        }
    }
    /* function debounce(fn, delay) {
        let timeoutId;
        let strings = [];

        return function (...args) {
            strings.push(...args);

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                fn(strings);
                strings = [];
            }, delay);
            console.log("i work");
        };
        
    } */
        /* function debounce(fn, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    fn(...args);
                }, delay);
            };
        } */

            

/*     async function messageFetch(message) {
        const BASE_URL = "https://aifounds.xyz";
        const url = `${BASE_URL}/api`;
      
        const payload = {
          user_id: "1",
          message: message,
        };
      
        const headers = {
          "Content-Type": "application/json",
        };
      
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log("Response from /api:", data);
                addMessage(data.message.charAt(0).toUpperCase() + data.message.slice(1), 'other_message');
            return data;
          } else if (response.status === 404) {
            console.error("Error: User not found");
          } else {
            console.error(
              "Error:",
              response.status,
              await response.text()
            );
          }
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      }; */
/* 
      async function createUserFetch(userId) {
        const BASE_URL = "https://aifounds.xyz";
        const url = `${BASE_URL}/create_user`;
        const payload = {
          user_id: "1",
        };
        const headers = {
          "Content-Type": "application/json",
        };
      
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log("Response from /create_user:", data);
            return data;
          } else {
            console.error("Error:", response.status, response.statusText);
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error during fetch:", error);
          throw error;
        }
      }; */
      let writeWaiting = 0;
      let dataMessage = '';
      console.log(writeWaiting);
      console.log(dataMessage);


      function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            return new Promise((resolve) => {
                timeout = setTimeout(() => {
                    resolve(func.apply(this, args));
                }, wait);
            });
        };
    }

    async function handleMessage() {
      if (messageBuffer) {
          console.log("Обработка сообщения...");
          // Запускаем обе функции параллельно в рамках одного await
          await Promise.all([
              messageFetch(messageBuffer),
              /* createLoadingText('.chat_message-window', writeWaiting) */
          ]);
          messageBuffer = '';
      }
  }
/*     async function handleMessage() {
        if (messageBuffer) {
            console.log("Начало обработки сообщения");
            try {
                const data = await messageFetch(messageBuffer); */
                /* if (data) {
                    dataMessage = data.message;
                    createLoadingText('.chat_message-window');
                } */
           /*  } catch (error) {
                console.error("Ошибка при обработке сообщения:", error);
            }
            messageBuffer = '';
            console.log(writeWaiting);
        }
    } */
    
        async function createLoadingText(pasteTo, writeWaiting) {
          console.log("Создание загрузочного текста...");
          const waveDiv = document.createElement('div');
          waveDiv.classList.add('loading-wave');
      
          for (let i = 0; i < 4; i++) {
              const barDiv = document.createElement('div');
              barDiv.classList.add('loading-bar');
              waveDiv.appendChild(barDiv);
          }
          document.querySelector(pasteTo).insertAdjacentElement('afterbegin', waveDiv);
      
          // Установить таймер для окончательного скрытия
          setTimeout(() => {
              document.querySelectorAll('.loading-wave').forEach(elem => {
                  elem.classList.add('hidden');
              });
          }, writeWaiting);
      }

    document.querySelectorAll(".accordion-item").forEach((item) => {
        item.querySelector(".accordion-item-header").addEventListener("click", () => {
            item.classList.toggle("open");
        });
        
    });

    
    async function messageFetch(message) {
      console.log("Запрос на сервер для получения сообщения...");
      const userId = getUserIdFromCookie();
      if (!userId) {
          console.error("Ошибка: Идентификатор пользователя не найден в cookie");
          return Promise.reject("Идентификатор пользователя не найден в cookie");
      }
      const BASE_URL = "https://aifounds.xyz";
      const url = `${BASE_URL}/api/get_message`;
  
      const payload = {
          user_id: userId,
          message: message,
      };
  
      const headers = {
          "Content-Type": "application/json",
      };
  
      try {
          
  
          const response = await fetch(url, {
              method: "POST",
              headers: headers,
              body: JSON.stringify(payload),
          });
  
          if (response.ok) {
              const data = await response.json();
              dataMessage = data.message;
              writeWaiting = data.message.length / 10 * 1000;
              console.log("Данные получены успешно");
              console.log(writeWaiting);
  // Показываем loading text перед отправкой запроса
  createLoadingText('.chat_message-window', writeWaiting);
              setTimeout(() => {
                  addMessage(data.message.charAt(0).toUpperCase() + data.message.slice(1), 'other_message');
              }, writeWaiting);
              
              return data;
          } else if (response.status === 404) {
              console.error("Ошибка: Пользователь не найден");
              return Promise.reject("Пользователь не найден");
          } else {
              const errorText = await response.text();
              console.error("Ошибка:", response.status, errorText);
              return Promise.reject(`Ошибка: ${response.status} ${errorText}`);
          }
      } catch (error) {
          console.error("Ошибка во время запроса:", error);
          return Promise.reject(error);
      }
  }
      
 /*  async function handleMessage() {
    if (messageBuffer) {
        await debounce(async () => {
            await messageFetch(messageBuffer);
            console.log(messageBuffer);
            messageBuffer = '';
            console.log(messageBuffer);
            createLoadingText('.chat_message-window');
            console.log(dataMessage);
        }, 3000)();
    }
} */

    /* function fetchArray(strings) {
        const promise = new Promise((resolve, reject) => {

            fetch(`https://jsonplaceholder.typicode.com/comments/${Math.floor(Math.random() * 500)}`)
                .then(response => response.json())
                .then(response => resolve(response))

        })
        promise.then((data) => {
            setTimeout(() => {
                addMessage(data.body.charAt(0).toUpperCase() + data.body.slice(1), 'other_message');
            }, 0)
        })
        console.log(strings);
    } */
   /*  const debouncedFunction = debounce(messageFetch(), 3000); */
/*     messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let inputValue = document.querySelector('.form_textarea').value;
        if (inputValue) {
            addMessage(inputValue, 'my_message');
            console.log(inputValue);
            createLoadingText('.chat_message-window');
            debounce(messageFetch, 3000)(inputValue);
        }
        document.querySelector('.form_textarea').value = '';
    }) */

        messageForm.addEventListener('submit', (e) => {
          e.preventDefault();
          let inputValue = document.querySelector('.form_textarea').value;
          if (inputValue) {
              addMessage(inputValue, 'my_message');
      
              let currentTime = Date.now();
              if (currentTime - lastMessageTime < 10000) {
                  messageBuffer += ' ' + inputValue;
              } else {
                  if (messageBuffer) {
                      handleMessage();
                  }
                  messageBuffer = inputValue;
              }
              lastMessageTime = currentTime;
              console.log(messageBuffer);
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                  handleMessage();
              }, 10000);
          }
          document.querySelector('.form_textarea').value = '';
      });
    //боковое меню и бургер
    // document.querySelector('.burger').addEventListener('click', () => {
    //     document.querySelector('.chat_user_list-wrap').classList.add('active');
    //     document.querySelector('.chat_user-close-modal').style.display = 'block'
    // })
    // document.querySelector('.chat_user-close-modal').addEventListener('click', () => {
    //     document.querySelector('.chat_user_list-wrap').classList.remove('active')
    //     document.querySelector('.chat_user-close-modal').style.display = 'none'
    // })
    // document.querySelectorAll('.user_list-onBack')[1].addEventListener('click', () => {
    //     document.querySelector('.chat_user_list-wrap').classList.remove('active')
    // })


/* }); */
