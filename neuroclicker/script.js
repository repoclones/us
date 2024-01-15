(() => { //all possible upgrades
  let money = 0;
  let mpc = 1;
  let mps = 0;
  let mpcBots = 0;
  let autoBots = 0;
  let supers = 0;
  let autoMult = 1;
  let mpcMult = 1;
  let eventHappening = false;


  document.getElementById('resetPBttn').addEventListener('click', function() {
    window.location.assign("./reset");
  });

  // Read save

  if (localStorage.getItem('noticeShown') == undefined) {
    localStorage.setItem('noticeShown', 'true');
    document.getElementById('noticeText').style.opacity = '1';
    setTimeout(function() {
      document.getElementById('notice').style.opacity = '0';
      document.getElementById('notice').style.pointerEvents = 'none';
    }, 5000);
  } else {
    document.getElementById('notice').style.visibility = 'hidden';
  }

  if (localStorage.getItem('nextEvent') == undefined) localStorage.setItem('nextEvent', 'penguinRequest');
  if (localStorage.getItem('unlockedUpgrades') == undefined) localStorage.setItem('unlockedUpgrades', '[]');
  //displaying all assets
  if (localStorage.getItem('money') != undefined) money = JSON.parse(localStorage.getItem('money'));
  if (localStorage.getItem('mpc') != undefined) mpc = JSON.parse(localStorage.getItem('mpc'));
  if (localStorage.getItem('mps') != undefined) mps = JSON.parse(localStorage.getItem('mps'));
  if (localStorage.getItem('mpcBots') != undefined) mpcBots = JSON.parse(localStorage.getItem('mpcBots'));
  if (localStorage.getItem('autoBots') != undefined) autoBots = JSON.parse(localStorage.getItem('autoBots'));
  if (localStorage.getItem('supers') != undefined) supers = JSON.parse(localStorage.getItem('supers'));
  if (localStorage.getItem('autoMult') != undefined) autoMult = JSON.parse(localStorage.getItem('autoMult'));
  if (localStorage.getItem('mpcMult') != undefined) {
    // (MPC is only multiplied when the good ending is achieved)
    mpcMult = JSON.parse(localStorage.getItem('mpcMult'));
    light();
  }

  let unlockedUpgrades = JSON.parse(localStorage.getItem('unlockedUpgrades'));

  if (unlockedUpgrades.includes('auto')) document.getElementById('autoBttn').style.visibility = 'visible';
  if (unlockedUpgrades.includes('mpcBot')) document.getElementById('mpcBotBttn').style.visibility = 'visible';
  if (unlockedUpgrades.includes('autoBot')) document.getElementById('autoBotBttn').style.visibility = 'visible';
  if (unlockedUpgrades.includes('super')) document.getElementById('superBttn').style.visibility = 'visible';

  updateScreen();

  function updateScreen() {//any auto updates such as upgrades
    document.getElementById('money').innerText = `$${formatNumber(money)}`;
    if (mpc > 1) document.getElementById('mpc').innerText = `Money per Click: $${formatNumber(mpc)}`;
    if (((mps + (supers * mpc)) * autoMult) * mpcMult > 0) document.getElementById('mps').innerText = `Money per Second: $${formatNumber(((mps + (supers * mpc)) * autoMult))}`;
    const cost = (mpcBots * 50) + (autoBots * 100);
    if (cost > 0) document.getElementById('cost').innerText = `Cost per second: $${formatNumber(cost)}`;

    unlockedUpgrades = JSON.parse(localStorage.getItem('unlockedUpgrades'));

    if ((money >= 1000) && !(unlockedUpgrades.includes('auto'))) {
      document.getElementById('autoBttn').style.visibility = 'visible';
      unlockedUpgrades.push('auto');
    }

    if ((mpc >= 250) && !(unlockedUpgrades.includes('mpcBot'))) {
      document.getElementById('mpcBotBttn').style.visibility = 'visible';
      unlockedUpgrades.push('mpcBot');
    }

    if ((mps >= 500) && !(unlockedUpgrades.includes('autoBot'))) {
      document.getElementById('autoBotBttn').style.visibility = 'visible';
      unlockedUpgrades.push('autoBot');
    }

    localStorage.setItem('unlockedUpgrades', JSON.stringify(unlockedUpgrades));
  }

  function updateGame() { //setting displayed assets to match vars
    updateScreen();
    localStorage.setItem('money', money);
    localStorage.setItem('mpc', mpc);
    localStorage.setItem('mps', mps);
    localStorage.setItem('mpcBots', mpcBots);
    localStorage.setItem('autoBots', autoBots);
    localStorage.setItem('supers', supers);
  }

  document.getElementById('click').addEventListener('click', function() {
    money += mpcMult * mpc;
    updateGame();
  });

  document.getElementById('mpcBttn').addEventListener('click', function() {
    if (money >= 50) {
      mpc++;
      money -= 50;
      updateGame();
    }
  });



  document.getElementById('mpcBotBttn').addEventListener('click', function() {
    if (money >= 100_000) {
      mpcBots++;
      money -= 100_000;
      updateGame();
    }
  });

  document.getElementById('autoBttn').addEventListener('click', function() {
    if (money >= 100) {
      mps++;
      money -= 100;
      updateGame();
    }
  });

  document.getElementById('autoBotBttn').addEventListener('click', function() {
    if (money >= 1_000_000) {
      autoBots++;
      money -= 1_000_000;
      updateGame();
    }
  });

  document.getElementById('superBttn').addEventListener('click', function() {
    if (money >= 10_000_000) {
      supers++;
      money -= 10_000_000;
      updateGame();
    }
  });

  setInterval(function() {
    // Autoclickers
    money += ((mps + (supers * mpc)) * autoMult);

    // Bots
    const mpcBuyable = Math.floor(money / 50);
    const mpcBought = (mpcBots < mpcBuyable) ? mpcBots : mpcBuyable;
    mpc += mpcBought;
    money -= mpcBought * 50;

    const autosBuyable = Math.floor(money / 100);
    const autosBought = (autoBots < autosBuyable) ? autoBots : autosBuyable;
    mps += autosBought;
    money -= autosBought * 100;

    // Update
    updateGame();
  }, 1000);

  function formatNumber(number) {
    return (number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }


  // Click sound effects from cookie clicker
  const clickSounds = [new Audio('./Assets/click1.mp3'), new Audio('./Assets/click2.mp3'), new Audio('./Assets/click3.mp3'), new Audio('./Assets/click4.mp3'), new Audio('./Assets/click5.mp3')];

  class Event {
    constructor(name, img, text, options, timeMultiplier = 1) {
      this.name = name;
      this.img = img;
      this.text = text;
      this.options = options;
      this.timeMultiplier = timeMultiplier;
    }

    render() {
      document.getElementById('eventImg').src = this.img;
      document.getElementById('eventName').innerText = this.name;
      document.getElementById('eventBttns').style.visibility = 'hidden';

      // Hide, and remove event listeners by cloning and replacing
      for (let button of document.getElementById('eventBttns').children) {
        button.style.visibility = 'hidden';
        button.replaceWith(button.cloneNode(true));
      }

      document.getElementById('eventText').innerText = '';
      document.getElementById('eventShadow').style.visibility = 'visible';

      const text = this.text;
      const timeMultiplier = this.timeMultiplier;
      const options = this.options;

      let count = 0;
      const textInterval = setInterval(function() {
        document.getElementById('eventText').innerHTML += text.charAt(count);
        count++;
        const clickSound = clickSounds[Math.floor(Math.random() * clickSounds.length)];
        clickSound.play();

        if (count >= text.length) {
          for (let i in options) {
            const option = options[i];
            const button = document.getElementById(`eventBttn${+i + 1}`);

            button.addEventListener('click', option.function);
            button.innerText = option.text;
            button.style.visibility = 'visible';
          }
          return clearInterval(textInterval);
        }
      }, (50 * timeMultiplier));
    }

    clear() {
      document.getElementById('eventShadow').style.visibility = 'hidden';
      for (let button of document.getElementById('eventBttns').children) {
        button.style.visibility = 'hidden';
      }
    }
  }

  function doEvents() {
    const nextEvent = localStorage.getItem('nextEvent');
    unlockedUpgrades = JSON.parse(localStorage.getItem('unlockedUpgrades'));
    let event;

    if ((eventHappening == false) && (nextEvent == 'penguinRequest') && (money >= 5_000_000) && (unlockedUpgrades.length >= 3)) {
      eventHappening = true;
      const event = new Event(
        'Join the Swarm',
        './Assets/neuro.png', //no
        'Hey! You there! Are you willing to join the Swarm? We have a small gift for you if you do, and you\'ll be fighting against god. All you have to do is join the swarm!',
        [
          {
            'text': 'Decline the Offer',
            'function': function() {
              event.text = 'Alright, We understand :(';
              event.options = [{
                'text': 'Continue',
                'function': function() {
                  eventHappening = false;
                  event.clear();
                  localStorage.setItem('nextEvent', 'pigeonRequest');
                }
              }];
              event.render();
            }
          },
          {
            'text': 'Join the Swarm',
            'function': function() {
              event.img = './Assets/penguinHappy.png' //no 
              event.text = 'Great! Try to build up some more money, we\'ll be back to give you our gift once we think you have enough to offer the swarm.';
              event.options = [{
                'text': 'Continue',
                'function': function() {
                  eventHappening = false;
                  event.clear();
                  localStorage.setItem('nextEvent', 'pigeonRequest');
                  localStorage.setItem('alliance', 'penguin');
                }
              }];
              event.render();
            }
          }
        ]
      );
      event.render();
    } else if ((eventHappening == false) && (nextEvent == 'pigeonRequest') && (money >= 7_500_000)) {
      eventHappening = true;
      const addedText = (localStorage.getItem('alliance') == 'penguin') ? ' God is watching, but God is generously allowing you to switch to the winning side. ' : ' ';
      const event = new Event(
        'Messenger',
        './Assets/pigeonDrone.gif',
        `You are being cordially invited to join God in the war against neurocord.${addedText}If you accept, you will be provided with many benefits to aid you in your money-making goals, decline, and you will be declared an enemy of God.`,
        [
          {
            'text': `Accept the invitation${(localStorage.getItem('alliance') == 'penguin') ? ' and betray the Swarm' : ''}`,
            'function': function() {
              event.text = 'We will be back soon. Avoid all communication with the Swarm.';
              event.options = [{
                'text': 'Continue',
                'function': function() {
                  eventHappening = false;
                  event.clear();
                  localStorage.setItem('betrayed', 'true');
                  if (localStorage.getItem('alliance') == 'penguin') {
                    localStorage.setItem('nextEvent', 'penguinPay');
                  } else {
                    localStorage.setItem('nextEvent', 'pigeonPay');
                  }
                  localStorage.setItem('alliance', 'pigeon');
                }
              }];
              event.render();
            }
          },
          {
            'text': 'Deny the invitation and anger God',
            'function': function() {
              eventHappening = false;
              if (localStorage.getItem('alliance') == 'penguin') {
                localStorage.setItem('nextEvent', 'penguinPay');
              } else {
                localStorage.setItem('nextEvent', 'none');
              }
              event.clear();
            }
          }
        ]
      );
      event.render();
    } else if ((eventHappening == false) && (nextEvent == 'penguinPay') && (money >= 10_000_000)) {
      eventHappening = true;
      const event = new Event(
        'Mito',
        './Assets/penguinHappy.png',
        'Hello! We\'ve returned with your gift, a new, one-time upgrade that multiplies all of your autoclickers, past, present, and future, by 2! In exchange for $10M, it\'s all yours.',
        [
          {
            'text': 'Accept the offer',
            'function': function() {
              money -= 10_000_000;
              autoMult = 2;
              localStorage.setItem('autoMult', 2);
              event.text = 'Great! We\'ll be back soon.';
              event.options = [{
                'text': 'Continue',
                'function': function() {
                  eventHappening = false;
                  event.clear();
                  if (localStorage.getItem('alliance') == 'pigeon') {
                    localStorage.setItem('nextEvent', 'pigeonPay');
                  } else {
                    localStorage.setItem('nextEvent', 'penguinMeeting');
                  }
                }
              }];
              event.render();
            }
          },
          {
            'text': 'Decline the offer',
            'function': function() {
              event.text = 'Alright. We\'ll be back soon.';
              event.options = [{
                'text': 'Continue',
                'function': function() {
                  eventHappening = false;
                  event.clear();
                  if (localStorage.getItem('alliance') == 'pigeon') {
                    localStorage.setItem('nextEvent', 'pigeonPay');
                  } else {
                    localStorage.setItem('nextEvent', 'penguinMeeting');
                  }
                }
              }];
              event.render();
            }
          }
        ]
      );
      if (localStorage.getItem('alliance') == 'pigeon') {
        event.options.push({
          'text': 'Admit to betraying us!',
          'function': function() {
            event.img = './Assets/penguinAngry.png'
            event.text = 'HOW DARE YOU?!!! We WON\'T be back. ';
            event.options = [{
              'text': 'Continue',
              'function': function() {
                eventHappening = false;
                event.clear();
                localStorage.setItem('admitted', 'true');
                localStorage.setItem('nextEvent', 'pigeonPay');
              }
            }];
            event.render();
          }
        });
      }
      event.render();
    } else if ((eventHappening == false) && (nextEvent == 'penguinMeeting') && (money >= 15_000_000)) {
      eventHappening = true;
      if ((localStorage.getItem('alliance') == 'pigeon') && (localStorage.getItem('betrayed') != 'true')) {
        localStorage.setItem('nextEvent', 'pigeonMeeting');
        return eventHappening = false;
      }
      const text = (localStorage.getItem('alliance') == 'pigeon') ? 'Hello there, TRAITOR. We\'ve intercepted some of your communications, and we know you\'ve been consorting with the holy ones. HOW COULD YOU?! We WON\'T be back.' : 'Hello! We just wanted to let you know that we\'ll be gone for a little while, but back soon enough, perhaps with some more things to offer you!';
      const event = new Event(
        'Mito',
        (localStorage.getItem('alliance') == 'pigeon') ? './Assets/penguinAngry.png' : './Assets/penguin.png',
        text,
        [
          {
            'text': 'Continue',
            'function': function() {
              if (localStorage.getItem('alliance') == 'pigeon') {
                localStorage.setItem('nextEvent', 'pigeonMeeting');
              } else {
                localStorage.setItem('nextEvent', 'penguinFinal');
              }
              event.clear();
              eventHappening = false;
            }
          }
        ]
      );
      event.render();
    } else if ((eventHappening == false) && (nextEvent == 'penguinFinal') && (money >= 10_000_000_000)) {
      eventHappening = true;
      const event = new Event(
        'Mito',
        './Assets/penguinHappy.png',
        'Hello! Now that you\'ve gotten pretty far along into the game, I\'d like to congratulate and thank you. You\'ve gotten so far, all with only us Neurofumos to help you. We know that god came, and tried to convice you to betray us, but you refused. And for that, I\'m grateful. Thank you. Please enjoy a permanent money per click buff of x100, just rememeber it\'s not just about the money, but how much fun you have. Thank you for playing so honestly, so generously, even though it\'s just a silly little spin-off idle game with questionable character interactions and questionable coding skills! You are one of the better players. (P.S. Don\'t worry about the colors, it means you got the good ending.)',
        [
          {
            'text': 'Continue',
            'function': function() {
              event.clear();
              eventHappening = false;
              localStorage.setItem('nextEvent', 'none');
            }
          }
        ]
      );
      event.render();
      mpcMult = 100;
      localStorage.set('mpcMult', 100);
      light();
    } else if ((eventHappening == false) && (nextEvent == 'pigeonPay') && (money >= 50_000_000)) {
      eventHappening = true;
      const addedText = (autoMult == 2) ? ' We are aware that you sustained contact with god, even if to purchase an upgrade. Do not let it happen again. ' : ' ';
      const event = new Event(
        'Neurocord Drone',
        './Assets/pigeonDrone.gif',
        `Hello.${addedText}We can now offer you a new upgrade. Invented at the Neurocord R&D(scientist are paid in rune art) department, the superclicker clicks once every second, but instead of giving you $1, it gives you as much money as you would make by clicking once yourself. We are prepared to allow you to access the upgrade at no cost to yourself, but every superclicker you purchase will cost $10M.`,
        [
          {
            'text': 'Continue',
            'function': function() {
              event.clear();
              eventHappening = false;
            }
          }
        ]
      );
      event.render();
      if (localStorage.getItem('betrayed') == 'true') {
        localStorage.setItem('nextEvent', 'penguinMeeting');
      } else {
        localStorage.setItem('nextEvent', 'pigeonMeeting');
      }
      unlockedUpgrades = JSON.parse(localStorage.getItem('unlockedUpgrades'));
      unlockedUpgrades.push('super');
      localStorage.setItem('unlockedUpgrades', JSON.stringify(unlockedUpgrades));
      document.getElementById('superBttn').style.visibility = 'visible';
    } else if ((eventHappening == false) && (nextEvent == 'pigeonMeeting') && (money >= 10_000_000_000)) {
      eventHappening = true;
      const event = new Event(
        '? ? ?',
        './Assets/pigeonDrone.gif',
        'Hello. I\'m here to congratulate you on behalf of God for your exellence in your work. Please continue in your productivity. In other news, we now have a graphic designer, so expect a change in theming. COMPANY NOTICE: We have recieved complaints of strange events going underway, please know that we are not related to any auditory hallucinations experienced by you or other employees, if you experience any strange noises or voices, please ignore them and \uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD immediately. Remember, we cannot afford to any unsafe or unhappy employees! We will contact you soon.',
        [
          {
            'text': 'Continue',
            'function': function() {
              event.clear();
              eventHappening = false;
              localStorage.setItem('nextEvent', 'pigeonFinal');
            }
          }
        ]
      );
      event.render();
      setTimeout(evil, 11000);
    } else if ((eventHappening == false) && (nextEvent == 'pigeonFinal') && (money >= 1_000_000_000_000)) {
      eventHappening = true;
      const event = new Event(
        'Click, Click, Click',
        './Assets/pigeon.png',
        'Congratualtions! Now that you\'ve reached a net value of $1T, we want to offer you a full position in the Neurocord ranks. You will continue working exactly as you have been already, and receive no other benefits.',
        [
          {
            'text': 'Accept',
            'function': function() {
              event.text = 'Great! Just remember, any feelings of dread, guilt, paranoia, or auditory and/or visual hallucinations are completely unrelated to your job. Your job is perfect. You are imperfect. Have a good day!';
              event.options = [
                {
                  'text': 'Continue',
                  'function': function() {
                    event.clear();
                    eventHappening = false;
                    localStorage.setItem('nextEvent', 'insanity');
                  }
                }
              ];
              event.render();
            }
          },
          {
            'text': 'Decline',
            'function': function() {
              event.img = '/Assets/pigeonAngry.png'
              event.text = 'You\'re too far in to leave now. You think you have any influence over yourself? Your decisions no longer matter. All that matters now is how long it takes you to give in. To realize what you did, what you chose, with the last real choice you would ever make. Accept the promotion, give in to what you\'ve chosen and accept your fate.';
              const newOption = {
                'text': 'Accept',
                'function': function() {
                  event.img = './Assets/pigeon.png'
                  event.text = 'Great! Just remember, this job is perfect. You did this to yourself.';
                  event.options = [
                    {
                      'text': 'Continue',
                      'function': function() {
                        event.clear();
                        eventHappening = false;
                        localStorage.setItem('nextEvent', 'insanity');
                      }
                    }
                  ];
                  event.render();
                }
              }
              event.options = [
                newOption,
                newOption
              ];
              event.render();
            }
          }
        ]
      );
      event.render();
    } else if ((eventHappening == false) && (nextEvent == 'insanity') && (money >= 5_000_000_000_000_000_000_000_000_000_000_000)) {
      event.text = "y just y"
      eventHappening = true;
      insane();
    }
  }

  document.addEventListener('click', function() {
    setTimeout(doEvents, (Math.random() * 5000));
  });

  function light() {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    document.body.style.boxShadow = '0px 0px 100px 10px rgba(255,255,130,0.5) inset';
  }

  function evil() {
    document.body.classList.add('evil');
    document.body.classList.remove('dark');
    document.body.style.boxShadow = '0px 0px 50px 15px rgba(255,0,0,0.3) inset';
    document.getElementById('click').innerHTML = `<img src="./Assets/eye.png">`;
    setTimeout(function() {
      document.getElementById('hands').style.opacity = '1';
    }, 2000);
  }

  function insane() {
    // Fade to black
    document.getElementById('fade').style.animationPlayState = 'running';
    // Prepare to play video
    setTimeout(function() {
      heartbeatAudio.volume = 0;
      atmosphereAudio.volume = 0;
      document.getElementById('video').style.visibility = 'visible';
      document.getElementById('video').play();
      setTimeout(function() {
        localStorage.clear();
        window.location.reload();
      }, 35000);
    }, 35000);

    // Stop all audio
    clearInterval(audioManageInterval);
  }

  // Audio

  const atmosphereAudio = new Audio('./Assets/atmosphere.mp3');
  const heartbeatAudio = new Audio('./Assets/heartbeat.mp3');
  const softAmbiences = [new Audio('./Assets/ambienceSoft1.mp3'), new Audio('./Assets/ambienceSoft2.mp3'), new Audio('./Assets/ambienceSoft3.mp3'), new Audio('./Assets/ambienceSoft4.mp3'), new Audio('./Assets/ambienceSoft5.mp3')];
  const harshAmbiences = [new Audio('./Assets/ambienceHarsh1.mp3'), new Audio('./Assets/ambienceHarsh2.mp3'), new Audio('./Assets/ambienceHarsh3.mp3'), new Audio('./Assets/ambienceHarsh4.mp3')];

  let atmospherePlaying = false;
  let heartbeatPlaying = false;
  let audioIntervalStarted = false;
  let audioManageInterval;

  document.addEventListener('click', function() {
    if ((audioIntervalStarted == false)) {
      audioIntervalStarted = true;
      audioManageInterval = setInterval(manageAudio, 1000);
    }
  });

  function manageAudio() {
    const nextEvent = localStorage.getItem('nextEvent');

    if ((money >= 2_500_000_000_000) && (nextEvent == 'insanity')) {
      let percent = money / 5_000_000_000_000;
      if (percent > 1) percent = 1;
      heartbeatAudio.volume = (1 * percent);
      heartbeatAudio.playbackRate = ((2 * percent) + (percent - 0.5));

      if (heartbeatPlaying == false) {
        heartbeatAudio.loop = true;
        heartbeatAudio.play();
        heartbeatPlaying = true;
      }
    }

    if ((atmospherePlaying == false) && (money >= 100_000_000_000) && ((nextEvent == 'pigeonFinal') || (nextEvent == 'insanity'))) {
      atmospherePlaying = true;
      atmosphereAudio.volume = 0;
      atmosphereAudio.loop = true;

      atmosphereAudio.play();

      const volumeInterval = setInterval(function() {
        if (atmosphereAudio.volume >= .3) return clearInterval(volumeInterval);

        atmosphereAudio.volume += 0.01
      }, 1000);
    }

    if ((money >= 10_000_000_000) && (money < 50_000_000_000) && ((nextEvent == 'pigeonMeeting') || (nextEvent == 'pigeonFinal'))) {
      if ((Math.floor(Math.random() * (240 - 1 + 1)) + 1) == 1) {
        if (softAmbiences.length == 0) return;
        const index = Math.floor(Math.random() * softAmbiences.length);
        if (index == -1) return;
        softAmbiences[index].play();
        softAmbiences.splice(index, 1);
      }
    } else if (money >= 50_000_000_000) {
      if ((Math.floor(Math.random() * (180 - 1 + 1)) + 1) == 1) {
        if (harshAmbiences.length == 0) return;
        const index = Math.floor(Math.random() * harshAmbiences.length);
        if (index == -1) return;
        harshAmbiences[index].play();
        harshAmbiences.splice(index, 1);
      }
    }
  }
})();