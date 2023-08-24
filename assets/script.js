const createModal = (title, content, buttons, long) => {
    document.body.insertAdjacentHTML('beforeend', `<div class='modal'><div class='modal-container${long ? ' modal-container-long' : ''}'><div class='modal-header' style='width: 100%; text-align: center; justify-content: center;'>${title}</div><div class='modal-content'>${content}</div><div class='modal-buttons'></div></div></div>`);
    Object.keys(buttons).forEach((button) => {
        document.querySelector('.modal-buttons').insertAdjacentHTML('beforeend', `<div class="button">${button}</div>`);
        document.querySelector('.modal-buttons').lastChild.onclick = () => buttons[button]();
    });  
};
  
const parseCode = (g) => {
    const [deg, colors] = g.split('[')[1].split(']')[0].split(': ');
    const dir = deg.endsWith('deg') ? deg : 'to ' + (deg === 'up' ? 'top' : deg === 'down' ? 'bottom' : deg === 'right' ? 'right' : deg);
    return `linear-gradient(${dir}, ${colors.split(', ').join(', ')})`;
};

document.querySelector('#premadeMode').onclick = () => {
    document.querySelector('#premadeContent').style.display = 'block';
    document.querySelector('#selfmadeContent').style.display = 'none';
    document.querySelector('#fromBlookContent').style.display = 'none';

    document.querySelector('.premadeCodes').replaceChildren();

    const premadeCodes = {
        rainbow: `localStorage.setItem('chatColor', 'gradient=[25deg: #f20505, #f26c05, #f2da05, #74f205, #05f28b, #05a7f2, #050df2]')`,
        'shades of grey': `localStorage.setItem('chatColor', 'gradient=[25deg: #fcfcfc, #050505]')`,
        'firey red': `localStorage.setItem('chatColor', 'gradient=[25deg: #f20505, #f26c05, #f2da05]')`,
        'bright cyan': `localStorage.setItem('chatColor', 'gradient=[25deg: #b5fffd, #8cfffc, #77ebfc, #68ceed]')`,
        'rich gold': `localStorage.setItem('chatColor', 'gradient=[25deg: #f2d64b, #967e0b]')`,
        death: `localStorage.setItem('chatColor', 'gradient=[25deg: #ed1005, #0a0100]')`,
        'watching the sunset': `localStorage.setItem('chatColor', 'gradient=[195deg: #FFA41C, #FF24BD]')`,
        beach: `localStorage.setItem('chatColor', 'gradient=[75deg: #FAFF5C, #98FFF5]')`,
        striped: `localStorage.setItem('chatColor', 'gradient=[165deg: #5E38F7, #000000, #5E38F7, #000000, #5E38F7, #000000, #5E38F7]')`,
        passion: `localStorage.setItem('chatColor', 'gradient=[100deg: #fc1303, #9e0d03]')`,
        'blood orange': `localStorage.setItem('chatColor', 'gradient=[100deg: #fa7b05, #ad5605]')`,
        'ice cold': `localStorage.setItem('chatColor', 'gradient=[25deg: #bef7e7, #b5f5ec, #abeaed, #a5e7f0, #9edaf0]')`,
        'cotton candy': `localStorage.setItem('chatColor', 'gradient=[40deg: #ffbcd9, #A0D9EF]')`,
        'pretty in pastel': `localStorage.setItem('chatColor', 'gradient=[90deg: #ffb3ba, #ffdfba, #ffffba, #baffc9, #bae1ff]')`,
        'preposterous purple': `localStorage.setItem('chatColor', 'gradient=[right: #e0c3fc, #8ec5fc]')`,
    };  

    Object.entries(premadeCodes).forEach(async (code) => {
        document.querySelector('.premadeCodes').insertAdjacentHTML('beforeend', `<div class="premadeCode" style="background: ${parseCode(code[1])};" id=${code[0].replace(/ /g, '_')}></div>`);

        document.getElementById(code[0].replace(/ /g, '_')).onmouseover = () => document.querySelector('.quickInfo').innerHTML = `click to copy ${code[0]}`;
        document.getElementById(code[0].replace(/ /g, '_')).onmouseout = () => document.querySelector('.quickInfo').innerHTML = `click a gradient to copy...`;
        
        document.getElementById(code[0].replace(/ /g, '_')).onclick = async () => {
            await navigator.clipboard.writeText(code[1]);
            document.querySelector('.quickInfo').innerHTML = 'copied!';
            setTimeout(() => document.querySelector('.quickInfo').innerHTML = `click a gradient to copy...`, 2000);
        };
    });
};

document.querySelector('#customMode').onclick = () => {
    document.querySelector('#premadeContent').style.display = 'none';
    document.querySelector('#selfmadeContent').style.display = 'block';
    document.querySelector('#fromBlookContent').style.display = 'none';

    let cAngle = 8;
    let angles = [
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170,
        180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320,
        330, 340, 350, 360
    ];

    let holding = false;

    document.querySelector('#arrowIcon').onmousedown = () => {
        holding = true;
        let interval = setInterval(() => {
            if (!holding) return clearInterval(interval);
            if (cAngle < (angles.length - 1)) {
                cAngle++;
                document.querySelector('#arrowIcon').style.transform = 'rotate(' + angles[cAngle] + 'deg)';
            } else {
                cAngle = 0;
                document.querySelector('#arrowIcon').style.transform = 'rotate(' + angles[cAngle] + 'deg)';
            }
        }, 100);
    };

    document.querySelector('#arrowIcon').onmouseup = () => holding = false;
    
    window.updateGradientBar = () => {
        let colors = [...document.querySelectorAll('.gradientBar > * ')].map(x => x.style.cssText.split(';').filter(x1 => x1.split(': ')[0])[0].split(': ')[1]);
        if (colors.length === 1) document.querySelector('.gradientBar').style.background = colors[0];
        else document.querySelector('.gradientBar').style.background = 'linear-gradient(to right, ' + colors.join(', ') + ')';
    }

    window.customModeFix = (_this) => {
        _this.style.setProperty('--color', _this.value);
        _this.style.backgroundColor = _this.value;
        updateGradientBar();
    };

    document.querySelector('#plusIcon').onclick = () => {
        document.querySelector('.gradientBar').insertAdjacentHTML('beforeend', `<input class="gradientBarDot" oncontextmenu="this.remove();updateGradientBar();return false;" style="--color: #000000;" type="color" onchange="window.customModeFix(this)">`);
        customModeFix(document.querySelector('.gradientBar').lastElementChild);
    };

    document.querySelector('.createButton').onclick = async () => {
        let ch = [...document.querySelector('.gradientBar').children];

        if (ch.length < 2) return createModal('Error', 'You need to have at least two colors to make a gradient.', {
            OK: () => document.querySelector('.modal').remove(),
        });
        else if (ch.length > 7) return createModal('Error', 'You can only have up to 7 colors in a gradient.', {
            OK: () => document.querySelector('.modal').remove(),
        });

        let ang = angles[cAngle];
        ang = ang === 0 ? 'up' : ang === 90 ? 'right' : ang === 180 ? 'down' : ang === 270 ? 'left' : ang === undefined || ang === 'undefined' ? 'up' : ang + 'deg';

        let grS = [];
        for (let x of ch) grS.push(x.getAttribute('style').split(';').filter((x) => x.split(':')[0] === '--color')[0].split(':')[1]);

        await navigator.clipboard.writeText(`localStorage.setItem('chatColor', \`gradient=[${ang}: ${grS.join(', ')}]\`)`.replaceAll('  ', ' '));

        createModal('Gradient Copied!', `<text class="gradientPreview" style="background-image: ${parseCode('gradient=[' + ang + ': ' + grS.join(', ') + ']')};">The quick brown fox jumped over the lazy dog.</span>`, {
            'OK!': () => document.querySelector('.modal').remove(),
        });
    };
};

document.querySelector('#fromBlookMode').onclick = () => {
    document.querySelector('#premadeContent').style.display = 'none';
    document.querySelector('#selfmadeContent').style.display = 'none';
    document.querySelector('#fromBlookContent').style.display = 'block';
    
    const getDominantColors = (imgEl) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = imgEl.naturalWidth;
        canvas.height = imgEl.naturalHeight;
        ctx.drawImage(imgEl, 0, 0);

        const data = ctx.getImageData(0, 0, imgEl.naturalWidth, imgEl.naturalHeight).data;

        let pal = new ColorThief().getPalette(imgEl).map((x) => 'rgb(' + x.join(',') + ')').filter((x) => x !== 'rgb(0,0,0)')
        console.log(pal);
        return pal.slice(0, 2);
    };

    const rgbToHex = (rgb) => '#' + rgb.match(/\d+/g).map(x => (+x).toString(16).padStart(2, '0')).join('');

    document.querySelector('.genFromBlook').onclick = () => {
        document.querySelector('.generatingMessage').style.display = 'block';

        fetch('./scraper/blooks.json').then((r) => r.json()).then((res) => {
            if (!Object.keys(res).map(a => a.toLowerCase()).includes(document.querySelector('.blookName').value.toLowerCase())) return createModal(`Error`, `Unknown Blook.`, {
                OK: () => document.querySelector('.modal').remove()
            });

            let [ _, blookInfo ] = Object.entries(res).filter(a => a[0].toLowerCase() === document.querySelector('.blookName').value.toLowerCase())[0];

            const image = new Image()
            image.src = '.' + blookInfo.image.split('content')[1];
            image.onload = async () => {
                const colors = getDominantColors(image).map((x) => rgbToHex(x));
  
                let gradient = 'gradient=[90deg: ' + colors.join(', ') + ']';

                await navigator.clipboard.writeText(`localStorage.setItem('chatColor', \`${gradient}\`)`.replaceAll('  ', ' '));

                document.querySelector('.generatingMessage').style.display = 'none';
        
                createModal('Gradient Copied!', `<text class="gradientPreview" style="background-image: ${parseCode(gradient)};">The quick brown fox jumped over the lazy dog.</span>`, {
                    'OK!': () => document.querySelector('.modal').remove()
                });
            };
        });
    };
};

document.querySelector('.siteCredits').onclick = () => createModal('Credits', `
    Infinite Thanks to acai for making so much of this site possible.<br>
    You're truly a great friend.<br>
    - VR
`, {
    '<3': () => document.querySelector('.modal').remove()
}, true)