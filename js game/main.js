function renderHPLife() {
    const { elHP, damageHP, defaultHP } = this;
    elHP.innerText = `${damageHP} / ${defaultHP}`;
}

function renderProgressbarHP() {
    const { elProgressbar, damageHP, defaultHP } = this;
    const percent = (damageHP / defaultHP) * 100;
    elProgressbar.style.width = `${percent}%`;
    elProgressbar.classList.remove('low', 'critical');
    if (percent < 20) {
        elProgressbar.classList.add('critical');
    } else if (percent < 60) {
        elProgressbar.classList.add('low');
    }
}

function renderHP() {
    this.renderHPLife();
    this.renderProgressbarHP();
}

function changeHP(count) {
    const { damageHP } = this;
    const dealt = Math.min(count, damageHP);
    this.damageHP = damageHP - dealt;
    this.renderHP();
    return dealt;
}

const character = {
    name: 'Pikachu',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('health-character'),
    elProgressbar: document.getElementById('progressbar-character'),
    renderHPLife,
    renderProgressbarHP,
    renderHP,
    changeHP,
};

const enemy = {
    name: 'Charmander',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('health-enemy'),
    elProgressbar: document.getElementById('progressbar-enemy'),
    renderHPLife,
    renderProgressbarHP,
    renderHP,
    changeHP,
};

const $btnKick = document.getElementById('btn-kick');
const $btnStrong = document.getElementById('btn-strong');
const $log = document.getElementById('log');
const $logs = document.getElementById('logs');

function random(num) {
    return Math.ceil(Math.random() * num);
}
function generateLog(firstPerson, secondPerson, damage) {
    const { name: firstName, damageHP, defaultHP } = firstPerson;
    const { name: secondName } = secondPerson;

    const text = logs[random(logs.length) - 1]
        .replaceAll('[ПЕРСОНАЖ №1]', firstName)
        .replaceAll('[ПЕРСОНАЖ №2]', secondName)
        .replaceAll('\\<', '<')
        .replaceAll('\\>', '>');

    return `${text} -${damage}, [${damageHP}/${defaultHP}]`;
}
function addLog(text) {
    const $p = document.createElement('p');
    $p.innerText = text;
    $logs.insertBefore($p, $logs.children[0]);
}
function attack(name, enemyMax, selfMax) {
    const rounds = [
        [character, enemy, enemyMax],
        [enemy, character, selfMax],
    ];

    const damages = rounds.map(([attacker, defender, max]) => {
        const dealt = defender.changeHP(random(max));
        addLog(generateLog(defender, attacker, dealt));
        return dealt;
    });

    const [hitEnemy, hitSelf] = damages;
    $log.innerText = `${name}: ${enemy.name} -${hitEnemy}, ${character.name} -${hitSelf}`;
    checkEnd();
}

function checkEnd() {
    const { damageHP: enemyHP, name: enemyName } = enemy;
    const { damageHP: characterHP, name: characterName } = character;

    if (enemyHP > 0 && characterHP > 0) return;

    let result;
    if (enemyHP === 0 && characterHP === 0) {
        result = 'Нічия!';
    } else if (enemyHP === 0) {
        result = `${characterName} переміг!`;
    } else {
        result = `${enemyName} переміг!`;
    }
    $log.innerText = `${result} Натисни на логотип, щоб почати знову.`;
    addLog(result);
    $btnKick.disabled = true;
    $btnStrong.disabled = true;
}

function resetGame() {
    [character, enemy].forEach((person) => {
        const { defaultHP } = person;
        person.damageHP = defaultHP;
        person.renderHP();
    });
    $btnKick.disabled = false;
    $btnStrong.disabled = false;
    $log.innerText = 'Почни бій!';
    $logs.innerHTML = '';
}

$btnKick.addEventListener('click', () => attack('Thunder Jolt', 20, 10));
$btnStrong.addEventListener('click', () => attack('Mega Punch', 35, 20));
document.querySelector('.logo').addEventListener('click', resetGame);

resetGame();
