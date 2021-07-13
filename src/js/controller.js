import 								'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } 	from 	'./config.js';
import * as model 			from 	'./model.js';
import recipeView 			from 	'./views/recipeView.js';
import searchView 			from 	'./views/searchView.js';
import resultsView 			from 	'./views/resultsView.js';
import paginationView 		from 	'./views/paginationView.js';
import bookmarksView 		from 	'./views/bookmarksView.js';
import addRecipeView 		from 	'./views/addRecipeView.js';


/* ================================ */
/* CONTROL RECIPES
/* ================================ */
const controlRecipes = async function(){
	try{
		const id = window.location.hash.slice(1);
		if(!id) return;
		
		// RENDER SPINNER
		recipeView.renderSpinner();

		// UPDATE RESULTS VIEW TO MARK SELECTED SEARCH RESULT
		resultsView.update(model.getSearchResultsPage());

		// LOAD RECIPE
		await model.loadRecipe(id);
		
		// RENDER RECIPE
		recipeView.render(model.state.recipe);

		// UPDATING BOOKMARK VIEW
		bookmarksView.update(model.state.bookmarks);
	}catch(err){
		recipeView.renderError();
	}
};


/* ================================ */
/* CONTROL SEARCHING RESULTS
/* ================================ */
const controlSearchResults = async function(){
	try{
		// RENDER SPINNER
		resultsView.renderSpinner();
		
		// GETTING SEARCH QUERY
		const query = searchView.getQuery();
		if(!query) return;
		
		// LOADING SEARCH RESULTS
		await model.loadSearchResults(query);
		
		// RENDERING SEARCH RESULTS
		resultsView.render(model.getSearchResultsPage());
		
		// RENDERING INITIAL PAGINATION BUTTONS
		paginationView.render(model.state.search);
	}catch(err){
		console.error(err.message);
	}
}


/* ================================ */
/* CONTROL PAGINATION
/* ================================ */
const controlPagination = function(goToPage){
	// RENDER NEW RESULTS
	resultsView.render(model.getSearchResultsPage(goToPage));
	
	// RENDER NEW PAGINATION BUTTON
	paginationView.render(model.state.search);
}


/* ================================ */
/* CONTROL SERVINGS
/* ================================ */
const controlServings = function(newServings){
	// UPDATE THE RECIPE SERVINGS (IN STATE)
	model.updateServings(newServings);
	
	// UPDATE THE RECIPE VIEW
	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
}


/* ================================ */
/* CONTROL ADD BOOKMARK
/* ================================ */
const controlAddBookmark = function(){
	// ADD OR REMOVE BOOKMARK
	if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);
	
	// UPDATE RECIPE VIEW
	recipeView.update(model.state.recipe);
	
	// RENDER BOOKMARKS
	bookmarksView.render(model.state.bookmarks);
}


/* ================================ */
/* CONTROL BOOKMARK
/* ================================ */
const controlBookmarks = function(){
	bookmarksView.render(model.state.bookmarks);
}


/* ================================ */
/* CONTROL ADD RECIPES
/* ================================ */
const controlAddRecipe = async function(newRecipe){
	try{
		// SHOW LOADING SPINNER;
		addRecipeView.renderSpinner();

		// UPLOAD NEW RECIPE DATA
		await model.uploadRecipe(newRecipe);
		console.log(model.state.recipe)

		// RENDER RECIPE
		recipeView.render(model.state.recipe);

		// SUCCESS MESSAGE
		addRecipeView.renderMessage();

		// RENDER BOOKMARK VIEW
		bookmarksView.render(model.state.bookmarks);

		// CHANGE ID OF THE URL
		window.history.pushState(null, '', `#${model.state.recipe.id}`);

		// CLOSE FORM WINDOW
		setTimeout(function(){
			addRecipeView.toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	}catch(err){
		console.error(`${err.message}`);
		addRecipeView.renderError(err.message);
	}
}


/* ================================ */
/* PUBLISHER-SUBSCRIBER MODEL
/* ================================ */
const init = function(){
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();


