const inputText = document.getElementById("alias");
let items = document.querySelectorAll("#aliases option");
const tab = [];
let index;
for (let i = 0; i < items.length; i++) tab.push(items[i].innerHTML);
for (let i = 0; i < items.length; i++) {
    items[i].onclick = () => {
        index = tab.indexOf(this.innerHTML);
        inputText.value = this.innerHTML;
    };
};
function refreshArray() {
    tab.length = 0;
    items = document.querySelectorAll("#aliases option");
    for (let i = 0; i < items.length; i++) tab.push(items[i].innerHTML);
};
function addAlias() {
    if (!inputText.value) return;
    const listNode = document.getElementById("aliases");
    for (const node of listNode.childNodes.values()) {
        if (node.value == inputAllowedRole.value) return;
    };
    const textNode = document.createTextNode(inputText.value);
    const liNode = document.createElement("option");
    liNode.appendChild(textNode);
    listNode.appendChild(liNode);
    liNode.setAttribute("style", "color: white;");
    liNode.setAttribute("value", inputText.value);
    liNode.setAttribute("selected", true);
    refreshArray();
    liNode.onclick = () => {
        index = tab.indexOf(liNode.innerHTML);
        inputText.value = liNode.innerHTML;
    };
};
function deleteAlias() {
    refreshArray();
    if (items.length > 0) {
        items[index].parentNode.removeChild(items[index]);
        inputText.value = "";
    };
};

//ALLOWED ROLES\\
const inputAllowedRole = document.getElementById("allowedRole");
let allowedRoles = document.querySelectorAll("#allowedRoles option");
const allowedRoleTab = [];
let allowedRoleIndex;
for (let i = 0; i < allowedRoles.length; i++) allowedRoleTab.push(allowedRoles[i].innerHTML);
for (let i = 0; i < allowedRoles.length; i++) {
    allowedRoles[i].onclick = () => {
        allowedRoleIndex = allowedRoleTab.indexOf(this.innerHTML);
        inputAllowedRole.value = this.innerHTML;
    };
};
function refreshAllowedRolesArray() {
    allowedRoleTab.length = 0;
    allowedRoles = document.querySelectorAll("#allowedRoles option");
    for (let i = 0; i < allowedRoles.length; i++) allowedRoleTab.push(allowedRoles[i].innerHTML);
};
function addAllowedRole() {
    if (!inputAllowedRole.value) return;
    const listNode = document.getElementById("allowedRoles");
    for (const node of listNode.childNodes.values()) {
        if (node.value == inputAllowedRole.value) return;
    };
    const textNode = document.createTextNode(inputAllowedRole.value);
    const optionNode = document.createElement("option");
    optionNode.appendChild(textNode);
    listNode.appendChild(optionNode);
    optionNode.setAttribute("style", "color: white;");
    optionNode.setAttribute("value", inputAllowedRole.value);
    optionNode.setAttribute("selected", true);
    refreshAllowedRolesArray();
    optionNode.onclick = () => {
        allowedRoleIndex = allowedRoleTab.indexOf(optionNode.innerHTML);
        inputAllowedRole.value = optionNode.innerHTML;
    };
};
function deleteAllowedRole() {
    refreshAllowedRolesArray();
    if (allowedRoles.length > 0) {
        allowedRoles[allowedRoleIndex].parentNode.removeChild(allowedRoles[allowedRoleIndex]);
        inputAllowedRole.value = "";
    };
};

//NOT ALLOWED ROLES\\
const inputNotAllowedRole = document.getElementById("notAllowedRole");
let notAllowedRoles = document.querySelectorAll("#notAllowedRoles option");
const notAllowedRoleTab = [];
let notAllowedRoleIndex;
for (let i = 0; i < notAllowedRoles.length; i++) notAllowedRoleTab.push(notAllowedRoles[i].innerHTML);
for (let i = 0; i < notAllowedRoles.length; i++) {
    notAllowedRoles[i].onclick = () => {
        notAllowedRoleIndex = notAllowedRoleTab.indexOf(this.innerHTML);
        inputNotAllowedRole.value = this.innerHTML;
    };
};
function refreshNotAllowedRolesArray() {
    notAllowedRoleTab.length = 0;
    notAllowedRoles = document.querySelectorAll("#notAllowedRoles option");
    for (let i = 0; i < notAllowedRoles.length; i++) notAllowedRoleTab.push(notAllowedRoles[i].innerHTML);
};
function addNotAllowedRole() {
    if (!inputNotAllowedRole.value) return;
    const listNode = document.getElementById("notAllowedRoles");
    for (const node of listNode.childNodes.values()) {
        if (node.value == inputNotAllowedRole.value) return;
    };
    const textNode = document.createTextNode(inputNotAllowedRole.value);
    const optionNode = document.createElement("option");
    optionNode.appendChild(textNode);
    listNode.appendChild(optionNode);
    optionNode.setAttribute("style", "color: white;");
    optionNode.setAttribute("value", inputNotAllowedRole.value);
    optionNode.setAttribute("selected", true);
    refreshNotAllowedRolesArray();
    optionNode.onclick = () => {
        notAllowedRoleIndex = notAllowedRoleTab.indexOf(optionNode.innerHTML);
        inputNotAllowedRole.value = optionNode.innerHTML;
    };
};
function deleteNotAllowedRole() {
    refreshNotAllowedRolesArray();
    if (notAllowedRoles.length > 0) {
        notAllowedRoles[notAllowedRoleIndex].parentNode.removeChild(notAllowedRoles[notAllowedRoleIndex]);
        inputNotAllowedRole.value = "";
    };
};

//ALLOWED CHANNELS\\
const inputAllowedChannel = document.getElementById("allowedChannel");
let allowedChannels = document.querySelectorAll("#allowedChannels option");
const allowedChannelTab = [];
let allowedChannelIndex;
for (let i = 0; i < allowedChannels.length; i++) allowedChannelTab.push(allowedChannels[i].innerHTML);
for (let i = 0; i < allowedChannels.length; i++) {
    allowedChannels[i].onclick = () => {
        allowedChannelIndex = allowedChannelTab.indexOf(this.innerHTML);
        inputAllowedChannel.value = this.innerHTML;
    };
};
function refreshAllowedChannelsArray() {
    allowedChannelTab.length = 0;
    allowedChannels = document.querySelectorAll("#allowedChannels option");
    for (let i = 0; i < allowedChannels.length; i++) allowedChannelTab.push(allowedChannels[i].innerHTML);
};
function addAllowedChannel() {
    if (!inputAllowedChannel.value) return;
    const listNode = document.getElementById("allowedChannels");
    for (const node of listNode.childNodes.values()) {
        if (node.value == inputAllowedChannel.value) return;
    };
    const textNode = document.createTextNode(inputAllowedChannel.value);
    const optionNode = document.createElement("option");
    optionNode.appendChild(textNode);
    listNode.appendChild(optionNode);
    optionNode.setAttribute("style", "color: white;");
    optionNode.setAttribute("value", inputAllowedChannel.value);
    optionNode.setAttribute("selected", true);
    refreshAllowedChannelsArray();
    optionNode.onclick = () => {
        allowedChannelIndex = allowedChannelTab.indexOf(optionNode.innerHTML);
        inputAllowedChannel.value = optionNode.innerHTML;
    };
};
function deleteAllowedChannel() {
    refreshAllowedChannelsArray();
    if (allowedChannels.length > 0) {
        allowedChannels[allowedChannelIndex].parentNode.removeChild(allowedChannels[allowedChannelIndex]);
        inputAllowedChannel.value = "";
    };
};

//NOT ALLOWED CHANNELS\\
const inputNotAllowedChannel = document.getElementById("notAllowedChannel");
let notAllowedChannels = document.querySelectorAll("#notAllowedChannels option");
const notAllowedChannelTab = [];
let notAllowedChannelIndex;
for (let i = 0; i < notAllowedChannels.length; i++) notAllowedChannelTab.push(notAllowedChannels[i].innerHTML);
for (let i = 0; i < notAllowedChannels.length; i++) {
    notAllowedChannels[i].onclick = () => {
        notAllowedChannelIndex = notAllowedChannelTab.indexOf(this.innerHTML);
        inputNotAllowedChannel.value = this.innerHTML;
    };
};
function refreshNotAllowedChannelsArray() {
    notAllowedChannelTab.length = 0;
    notAllowedChannels = document.querySelectorAll("#notAllowedChannels option");
    for (let i = 0; i < notAllowedChannels.length; i++) notAllowedChannelTab.push(notAllowedChannels[i].innerHTML);
};
function addNotAllowedChannel() {
    if (!inputNotAllowedChannel.value) return;
    const listNode = document.getElementById("notAllowedChannels");
    for (const node of listNode.childNodes.values()) {
        if (node.value == inputNotAllowedChannel.value) return;
    };
    const textNode = document.createTextNode(inputNotAllowedChannel.value);
    const optionNode = document.createElement("option");
    optionNode.appendChild(textNode);
    listNode.appendChild(optionNode);
    optionNode.setAttribute("style", "color: white;");
    optionNode.setAttribute("value", inputNotAllowedChannel.value);
    optionNode.setAttribute("selected", true);
    refreshNotAllowedChannelsArray();
    optionNode.onclick = () => {
        notAllowedChannelIndex = notAllowedChannelTab.indexOf(optionNode.innerHTML);
        inputNotAllowedChannel.value = optionNode.innerHTML;
    };
};
function deleteNotAllowedChannel() {
    refreshNotAllowedChannelsArray();
    if (notAllowedChannels.length > 0) {
        notAllowedChannels[notAllowedChannelIndex].parentNode.removeChild(notAllowedChannels[notAllowedChannelIndex]);
        inputNotAllowedChannel.value = "";
    };
};

//ANSWERS\\
const answerInputText = document.getElementById("answer");
let answers = document.querySelectorAll("#answers option");
const answerTab = [];
let answerIndex;
for (let i = 0; i < answers.length; i++) answerTab.push(answers[i].innerHTML);
for (let i = 0; i < answers.length; i++) {
    answers[i].onclick = () => {
        answerIndex = answerTab.indexOf(this.innerHTML);
        answerInputText.value = this.innerHTML;
    };
};
function refreshAnswersArray() {
    answerTab.length = 0;
    answers = document.querySelectorAll("#answers option");
    for (let i = 0; i < answers.length; i++) answerTab.push(answers[i].innerHTML);
};
function addAnswer() {
    if (!answerInputText.value) return;
    const listNode = document.getElementById("answers");
    for (const node of listNode.childNodes.values()) {
        if (node.value == inputAllowedRole.value) return;
    };
    const textNode = document.createTextNode(answerInputText.value);
    const liNode = document.createElement("option");
    liNode.appendChild(textNode);
    listNode.appendChild(liNode);
    liNode.setAttribute("style", "color: white;");
    liNode.setAttribute("value", answerInputText.value);
    liNode.setAttribute("selected", true);
    refreshAnswersArray();
    liNode.onclick = () => {
        answerIndex = answerTab.indexOf(liNode.innerHTML);
        answerInputText.value = liNode.innerHTML;
    };
};
function deleteAnswer() {
    refreshAnswersArray();
    if (answers.length > 0) {
        answers[answerIndex].parentNode.removeChild(answers[answerIndex]);
        answerInputText.value = "";
    };
};