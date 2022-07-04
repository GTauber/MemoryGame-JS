
(() => {
   // Objeto global para a aplicação
   let app = {
      iniciar: function () {
         try {

            const sectionGame = document.querySelector("section");
            const playerLivesCount = document.querySelector("span")
            let totalLives = 0;
            const btnSub = document.getElementById("fSubmit");
            const btnEnd = document.getElementById("end");
            const btnRank = document.getElementById("results");
            let times = [];
            let timesLocal;
            btnSub.addEventListener('click', () => {
               window.alert('Aguarde 1 segundo até que todas as cartas do tabuleiro tenham sido desviradas e ocultadas novamente.')

               timeOptions.start();
               sectionOptions.showSection();
               console.log(sectionGame);
               showAllCards(sectionGame.childNodes, 1000);
            });
            btnEnd.addEventListener('click', () => {
               window.alert('Aguarde 1 segundo até que todas as cartas do tabuleiro tenham sido desviradas e ocultadas novamente.')

               clickOptions.invalidateClick();
                setTimeout(() => { 
                    restart(1000);
                }, 500);
               clickOptions.activeClick();
            });
            
            btnRank.addEventListener('click', () => {
                showRank();
            });
            
            function registerRank(duration) {
                let value = document.getElementById("fName").value;
                let time = {
                    name: value,
                    duration: duration,
                }
                if(localStorage.getItem("times")) {
                    timesLocal = JSON.parse(localStorage.getItem("times"))
                    timesLocal.push(time);
                    if(timesLocal.length >= 2) timesLocal.sort((a,b) => a.duration - b.duration);
                    localStorage.setItem("times",  JSON.stringify(timesLocal));
                } else {
                    times.push(time);
                    localStorage.setItem('times', JSON.stringify(times))
                }
            };
            
            function showRank() {
                timesLocal = JSON.parse(localStorage.getItem("times"));
                if (!timesLocal) window.alert("No games registered yet");
                else {
                    window.alert(`Melhores tempos: ${JSON.stringify(timesLocal)}`);
                }
            };
            
            let timeOptions = {
                startPoint: 0,
                durationPoint: 0,
                start() {
                    timeOptions.startPoint = performance.now();
                },
            
                duration() {
                    timeOptions.durationPoint = performance.now() - timeOptions.startPoint;
                }
            }
            
            const sectionOptions = {
                hideSection() {
                    sectionGame.style.display = 'none';
                    document.getElementById("register").style.display = "block"
                },
                showSection() {
                    document.getElementById("register").style.display = "none"
                    sectionGame.style.display = 'grid';
                    document.getElementById('end').style.display = "block"
                }
            }
            
            playerLivesCount.textContent = totalLives
            
            const getData = () => [
                { imgSrc: "images/angular.svg", name: "angular" },
                { imgSrc: "images/aurelia.svg", name: "aurelia" },
                { imgSrc: "images/backbone.svg", name: "backbone" },
                { imgSrc: "images/ember.svg", name: "ember" },
                { imgSrc: "images/js-badge.svg", name: "js-badge" },
                { imgSrc: "images/react.svg", name: "react" },
                { imgSrc: "images/vue.svg", name: "vue" },
                { imgSrc: "images/sass_logo.svg", name: "sass" },
                { imgSrc: "images/angular.svg", name: "angular" },
                { imgSrc: "images/aurelia.svg", name: "aurelia" },
                { imgSrc: "images/backbone.svg", name: "backbone" },
                { imgSrc: "images/ember.svg", name: "ember" },
                { imgSrc: "images/js-badge.svg", name: "js-badge" },
                { imgSrc: "images/react.svg", name: "react" },
                { imgSrc: "images/vue.svg", name: "vue" },
                { imgSrc: "images/sass_logo.svg", name: "sass" }
            ];
            
            const shuffle = () => {
                const cardsInfo = getData();
                cardsInfo.sort(() => Math.random() - 0.5);
                return cardsInfo;
            }
            
            
            const generateCards = () => {
                if(document.getElementById('end').getAttribute('hide')==="true"){
                    document.getElementById('end').style.display = "none"
                }
                const cardsInfo = shuffle();
                cardsInfo.forEach((img) => {
                    const card = document.createElement("div");
                    const face = document.createElement("img");
                    const back = document.createElement("div");
                    card.classList = "card";
                    face.classList = "face";
                    back.classList = "back";
                    face.src = img.imgSrc
                    card.setAttribute('name', img.name)
                    sectionGame.appendChild(card);
                    card.appendChild(face);
                    card.appendChild(back);
            
                    card.addEventListener('click', (e) => {
                        card.classList.add("turnCard");
                        validadeCard(e)
                    })
                });
            }
            
            const validadeCard = (e) => {
                const clickedCard = e.target;
                clickedCard.classList.add("flipped"); 
                const flipped = document.querySelectorAll('.flipped');
                let rightCards = document.querySelectorAll('.right');
                
                if (flipped.length === 2) {
                    clickOptions.invalidateClick();
                    if (flipped[0].getAttribute('name') === flipped[1].getAttribute('name')) {
                        flipped.forEach(card => {
                            card.style.pointerEvents = "none";
                            card.classList.remove('flipped');
                            card.classList.add("right")
                        }) 
                    } else {
                        totalLives++
                        flipped.forEach(card => {
                            card.classList.remove("flipped")
                            setTimeout(() => card.classList.remove("turnCard"), 1500)
                        });
                        
                        playerLivesCount.textContent = totalLives;
                        if(totalLives === 10) {
                            restart();
                        }
                    }
                    setTimeout(() => clickOptions.activeClick(), 1500);
                }
                console.log(`Antes do IF ${rightCards.length === 16} right ${rightCards}`)
                if (rightCards.length === 15) {
                  timeOptions.duration();
                  console.log(`duration: ${timeOptions.duration}`)
                  registerRank(timeOptions.durationPoint);
                  window.alert("Parabéns! Você ganhou! O jogo irá reiniciar");
                  restart(3000);
                }
            };
            const showAllCards = (cards, x) => {
                setTimeout(() => {
                    cards.forEach((card) => {
                        console.log(card)
                        card.classList.add("turnCard");
                    })        
                }, x)
                setTimeout(() => {
                        cards.forEach((card) => {
                        card.classList.remove("turnCard")
                    })
                }, 3500); // 3.5 Seg por causa do timing do animação -> resultam em 3 seg
            }
            
            const restart = (x=3500) => {
                let cardInfo = shuffle();
                let faces = document.querySelectorAll(".face");
                let cards = document.querySelectorAll(".card");
            
                timeOptions.start();
            
                sectionGame.style.pointerEvents = 'none'
                cardInfo.forEach((img, i) => {
                    setTimeout(() => {
                        cards[i].style.pointerEvents = 'all'
                        cards[i].classList.remove("turnCard");
                        cards[i].classList.remove("flipped");
                        faces[i].src = img.imgSrc;
                        cards[i].setAttribute('name', img.name);
                        cards[i].classList.remove("right")
                    }, x);
                });
                setTimeout(() => {
                    totalLives = 0;
                    playerLivesCount.textContent = totalLives;
                }, 1500);
            
                showAllCards(cards, x)
            }
            
            const clickOptions = {
                invalidateClick() {
                    let allCards = document.querySelectorAll('.card');
                    allCards.forEach(card => {
                        card.style.pointerEvents = 'none'
                    });
                },
                activeClick: () => {
                    let allCards = document.querySelectorAll('.card');
                    let rightCards = document.querySelectorAll('.right')
                    allCards.forEach(card => {
                        card.style.pointerEvents = 'all';
                    });
                    rightCards.forEach(card => {
                        card.style.pointerEvents = 'none';
                    });
                }
            }
            
            
            
            const startGame = () => {
            
                
            }
            
            generateCards();
            sectionOptions.hideSection();
            
            } catch (e) {
                window.alert("Ocorreu um erro, por fsvor reinicie a pagina");
                object.reload(forcedReload);
            }
         
      },
   
   }
   
   // Chamar o método do objeto global
   try {
      app.iniciar();
   } catch (error) {
      window.alert(`Ocorreu um erro, por favor reinicia a pagina; ${error}`)
   }

})();
