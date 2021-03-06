document.addEventListener("DOMContentLoaded", () => { 
	init();
});

function init() {
	getPages();
	showFirstPage();
	bindCompute();
	syncSubmitAndCompute();
	syncInputAndLocalstorage();
	initNavigation();
}

function getPages() {
	window.pages = {};
	document.querySelectorAll('[data-page-name]').forEach(page => {
		pages[page.getAttribute('data-page-name')] = page;
		page.style.display = 'none';
	});
};

function showFirstPage() {
	pages[Object.keys(pages)[0]].style.display = 'block';	
}

function bindCompute() {
	document.querySelectorAll('[data-computable]').forEach(elem => {
		elem.compute = compute.bind(elem);
	});	
}


function syncSubmitAndCompute() {
	document.querySelectorAll('form').forEach(form => {
		form.addEventListener('submit', (event) => {
			form.childNodes.forEach(element => {
				element.hasAttribute && element.hasAttribute('data-computable') && element.compute();
			})
			event.preventDefault();
		})
	})
}

function syncInputAndLocalstorage() {
	document.querySelectorAll('input[data-storagable]').forEach(input =>{
		input.addEventListener('input', () => {
			localStorage.setItem(input.getAttribute('data-storagable'), input.value);
		})
	})
}

function initNavigation() {
	function navigate(event) {
		var page = pages[this.getAttribute('data-navigate-to')];
		if (!page)
			return;
		
		this.style.display = 'none';
		page.style.display = 'block';
	}

	document.querySelectorAll('[data-navigate-to]').forEach(element => {
		let isForm = element.nodeName === "FORM";
		element.addEventListener(isForm ? 'submit' : 'click', navigate);
	})
}

/*
 * Расчет выражения из аттрибута data-computable
 */
function compute() {
	let expression = this.getAttribute('data-computable');

	getTemplateMatches(expression).forEach(match => {
		let template = match[0];
		let key = match[1];
		let value = getStoragableValue(key);

		if (isNaN(value)) {
			throw new Error('Invalid input value');
		}

		expression = expression.replace(template, value);
	})

	with (Math) {
		this.innerHTML = eval(expression);
	}
};


/*
 * Поиск выражений вида {{variable}}
 */
function getTemplateMatches(expression) {
	let regex = /{{(\w+)}}/g;
	let matches = [], match;
	while (match = regex.exec(expression)) {
		matches.push(match);
	}

	return matches;
}

/*
 * Получить значение по ключу из localStorage или из соответсвующего input
 */
function getStoragableValue(key) {
	if (lsKey = localStorage.getItem(key)) {
		return lsKey;
	}

	let storagableElem = document.querySelector(`[data-storagable="${key}"]`);
	
	if (!storagableElem) {
		throw new Error('Key is not found');
	}

	return storagableElem.value || '0';
}