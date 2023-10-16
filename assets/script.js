const createModal = (title, content, buttons, long) => {
    document.body.insertAdjacentHTML('beforeend', `<div class='modal'><div class='modal-container${long ? ' modal-container-long' : ''}'><div class='modal-header' style='width: 100%; text-align: center; justify-content: center;'>${title}</div><div class='modal-content'>${content}</div><div class='modal-buttons'></div></div></div>`);
    Object.keys(buttons).forEach((button) => {
        document.querySelector('.modal-buttons').insertAdjacentHTML('beforeend', `<div class="modal-button">${button}</div>`);
        document.querySelector('.modal-buttons').lastChild.onclick = () => buttons[button]();
    });  
};
  
const parseCode = (g) => {
    const [deg, colors] = g.split('[')[1].split(']')[0].split(': ');
    return `linear-gradient(${deg}, ${colors.split(', ').join(', ')})`;
};

document.querySelector('#premadeMode').onclick = () => {
    document.querySelector('#premadeContent').style.display = 'block';
    document.querySelector('#selfmadeContent').style.display = 'none';
    document.querySelector('#fromBlookContent').style.display = 'none';

    document.querySelector('.premadeCodes').replaceChildren();

    const premadeCodes = {
        rainbow: `localStorage.setItem('chatColor', 'gradient=[25deg: #f20505, #f26c05, #f2da05, #74f205, #05f28b, #05a7f2, #050df2]')`,
        'shades of grey': `localStorage.setItem('chatColor', 'gradient=[25deg: #fcfcfc, #050505]')`,
        'rich gold': `localStorage.setItem('chatColor', 'gradient=[25deg: #f2d64b, #967e0b]')`,
        death: `localStorage.setItem('chatColor', 'gradient=[25deg: #ed1005, #0a0100]')`,
        'watching the sunset': `localStorage.setItem('chatColor', 'gradient=[195deg: #FFA41C, #FF24BD]')`,
        beach: `localStorage.setItem('chatColor', 'gradient=[75deg: #FAFF5C, #98FFF5]')`,
        'preposterous purple': `localStorage.setItem('chatColor', 'gradient=[right: #e0c3fc, #8ec5fc]')`,
        'mega bot': `localStorage.setItem('chatColor', 'gradient=[90deg: #d71f27, #f7942c]')`,
        'dark dragon': `localStorage.setItem('chatColor', 'gradient=[90deg: #5a2081, #2d2635]')`,
        'golden crab': `localStorage.setItem('chatColor', 'gradient=[90deg: #9f7802, #f7dec7]')`,
        'golden gift': `localStorage.setItem('chatColor', 'gradient=[90deg: #e8c911, #9a00b2, #e8c911]')`,
        'tropical pig': `localStorage.setItem('chatColor', 'gradient=[90deg: #e6ca89, #f7a9e1, #76eafe]')`
    };  

    Object.entries(premadeCodes).forEach(async (code) => {
        document.querySelector('.premadeCodes').insertAdjacentHTML('beforeend', `
            <div class="premadeCodeRow" id=${code[0].replace(/ /g, '_')}>
                <div class="premadeCode" style="background: ${parseCode(code[1])};"></div>
                <div class="premadeCodeText">${code[0]}</div>
            </div>
        `);
        
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

    window.cAngle = 90;

    window.updateGradientBar = () => {
        let colors = [...document.querySelectorAll('.gradientBar > * ')].map(x => x.style.cssText.split(';').filter(x1 => x1.split(': ')[0])[0].split(': ')[1]);
        if (colors.length === 1) {
            document.querySelector('.gradientBar').style.background = colors[0];
            document.querySelector('.gradientPreview').style.backgroundImage = colors[0];
        } else {
            document.querySelector('.gradientBar').style.background = `linear-gradient(${window.cAngle}deg, ` + colors.join(', ') + ')';
            document.querySelector('.gradientPreview').style.backgroundImage = `linear-gradient(${window.cAngle}deg, ` + colors.join(', ') + ')';
        };
    };

    let holding = false;

    window.updateAngleArrow = () => {
        if (window.cAngle < 360) {
            window.cAngle++;
            document.querySelector('#arrowIcon').style.transform = 'rotate(' + window.cAngle + 'deg)';
        } else {
            window.cAngle = 0;
            document.querySelector('#arrowIcon').style.transform = 'rotate(' + window.cAngle + 'deg)';
        }
        updateGradientBar();
    }

    document.querySelector('#arrowIcon').onmousedown = (click) => {
        if (click.which === 3) {
            createModal('Quick Directions', `Here are some quick directions.`, {
                'Up': () => (window.cAngle = 0, window.updateAngleArrow(), document.querySelector('.modal').remove()),
                'Left': () => (window.cAngle = 270, window.updateAngleArrow(), document.querySelector('.modal').remove()),
                'Right': () => (window.cAngle = 90,window.updateAngleArrow(),  document.querySelector('.modal').remove()),
                'Down': () => (window.cAngle = 180, window.updateAngleArrow(),  document.querySelector('.modal').remove())
            });
            return;
        };

        holding = true;
        let interval = setInterval(() => {
            if (!holding) return clearInterval(interval);
            window.updateAngleArrow();
        }, 15);
    };

    document.querySelector('#arrowIcon').onmouseup = () => holding = false;

    window.customModeFix = (_this) => {
        _this.style.setProperty('--color', _this.value);
        _this.style.backgroundColor = _this.value;
        window.updateGradientBar();
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

        let grS = [];
        for (let x of ch) grS.push(x.getAttribute('style').split(';').filter((x) => x.split(':')[0] === '--color')[0].split(':')[1]);

        await navigator.clipboard.writeText(encode(`localStorage.setItem('chatColor', \`gradient=[${window.cAngle}deg: ${grS.join(', ')}]\`)`.replaceAll('  ', ' ')));

        createModal('Gradient Copied!', `<text class="gradientPreview" style="background-image: ${parseCode('gradient=[' + window.cAngle + 'deg: ' + grS.join(', ') + ']')};">The quick brown fox jumped over the lazy dog.</span>`, {
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
