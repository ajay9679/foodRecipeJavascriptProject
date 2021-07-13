import View from './view.js';
import icons from '../../img/icons.svg';
import previewView from './previewView.js';

class ResultsView extends View{
	_message = '';
	_parentElement = document.querySelector('.results');
	_errorMessage = 'No recipe found for your query!!!.';

	_generateMarkup(){
		return this._data.map(result => previewView.render(result, false)).join('');
	}
}

export default new ResultsView();








