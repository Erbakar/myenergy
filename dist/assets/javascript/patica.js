var url = window.location.href.split('/')[
  window.location.href.split('/').length - 1
];

export function initPatica(auth) {
  window.PaticaSidebar.events.on('login', (p) => console.log('login'));
  window.PaticaSidebar.events.on('error', (p) => {
    $('.patica-sidebar').removeClass('open');
    errorCallBack();
  });

  setTimeout(() => {
    if (!sessionStorage.getItem('programs_loaded')) {
      errorCallBack('Patica is unable to load programs in 10 sec');
    }
  }, 10000);

  window.PaticaSidebar.events.on('programs_loaded', (p) => {
    sessionStorage.setItem('programs_loaded', true);
    if (url === 'step1') {
      goToModulePatica(4, '8026c102d998956257c2d4ac7cce1c59');
    } else if (url === 'step2') {
      goToModulePatica(5, '25cc38d6c83b273d275bc186bc33d20a');
    } else if (url === 'step5') {
      goToModulePatica(8, '2919eef40f9b601c43ee1bcf06a76da8');
    } else if (url === 'step6' && !localStorage.getItem('isShowstep6Intro')) {
      goToModulePatica(9, 'e255c42577a3c2c8dcc86782b75fec41');
    } else if (url === 'step7' && !localStorage.getItem('isShowstep7Intro')) {
      goToModulePatica(10, 'b800c5cb4899c95ed8fc8b675ecc3927');
    } else {
      window.SidebarInstance.hide();
    }
  });
  window.PaticaSidebar.events.on('connected_to_socketkit', (p) =>
    console.log('connected_to_socketkit')
  );
  return window.PaticaSidebar.init({ token: auth });
}
export function openPatica() {
  if (window.SidebarInstance) {
    window.SidebarInstance.show();
  }
}

export function hidePatica() {
  if (window.SidebarInstance) {
    window.SidebarInstance.hide();
  }
}

export function goToModulePatica(ppathId, pmoduleId, count) {
  if (!count) {
    count = 0;
  }
  count++;
  var pathId = ppathId,
    moduleId = pmoduleId;
  if (sessionStorage.getItem('programs_loaded')) {
    window.SidebarInstance.gotoModule(pathId, moduleId);
  } else {
    if (count < 10) {
      setTimeout(function () {
        goToModulePatica(pathId, moduleId, count);
      }, 100);
    }
  }
}

function errorCallBack(p) {
  const token = JSON.parse(sessionStorage.getItem('credentials')).authToken;
  const errorMesage = { message: p };
  fetch(`${localStorage.getItem('environment')}/patica/error`, {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(errorMesage),
  });
}
