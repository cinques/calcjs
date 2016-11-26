var calculateBtn = document.getElementById('calculate');
calculateBtn.addEventListener('click', onCalculate);

document.querySelectorAll('[data-computable]').forEach(elem => {
	elem.compute = compute.bind(elem);
});

function onCalculate() {
	let computeElem = document.querySelector('[data-computable]');
	alert(computeElem.compute());
}

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

	return eval(expression);
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