const dateNight = {};
dateNight.yummlyID = "76925bc8";
dateNight.yummlyKey = "ca3a11a18cc19bc2b40a133aabd2d8f3";
dateNight.lcboKey = "MDo1OWQ2NDhjYy1jOThhLTExZTctOGU0NS1jYmRlNTZjZTFhMjE6bjFrWlMxYTkyR3hvdzRFY2c2OW1BZWVYQnN1QlR4R3pRMmt6";

$(function() {
    dateNight.init();
    // dateNight.responsive();
});

// I know I'm not supposed to leave code in here but... I want to ome back to this! :)
// dateNight.responsive = function() {
//     if ($(window).width() < 960) {
//         $('.wine button').insertBefore($('.wine button').parent());
//      } else if ($(window).width() < 960) {
//         $('.wine button').insertAfter($('.wine button').parent());
//      }
// }

dateNight.init = function() {
    dateNight.eventListener();
};

dateNight.eventListener = function() {
    $('.submit').on('click', function (e) {
        e.preventDefault();
        
        $('.foodAndWine').css({
            "display":"flex",
            "justify-content":"space-between"
        });

        $('html,body').animate({
            scrollTop: $(".foodAndWine").offset().top},
            1200);
            
        // grab value from main form element
        const mainIngredient = $("input[name=ingredient]:checked").val();
        dateNight.determineYummlyUrl(mainIngredient);
    });
    $('.backToTop').on('click', function() {
        $('html,body').animate({
            scrollTop: $("header").offset().top},
            1200);
    });
    // we moved this out of the above because it was previously adding a new listener everytime the user tried for a new recipe, even if they changed their selections. If the user asked for a new recipe, then pressed sumbit again, and then tried for new recipes again, the array losing more values than we wanted (more than one was unshifting per "try again")
    $(".differentRecipe").on('click', (e) => {
        e.preventDefault();
        dateNight.pickRecipe();
        dateNight.pickWine();
    });
};

dateNight.determineYummlyUrl = function(mainIngredient) {
    let activeUrl;
    // if diet is meat, set the basic url. If it's not meat, set the other url
    if (mainIngredient === "vegan" || mainIngredient === "vegetarian") {
        activeUrl = `http://api.yummly.com/v1/api/recipes?_app_id=${dateNight.yummlyID}&_app_key=${dateNight.yummlyKey}&q=${mainIngredient}&allowedCourse[]=course^course-Main+Dishes&maxResult=25`;
    } else {
        activeUrl = `http://api.yummly.com/v1/api/recipes?_app_id=${dateNight.yummlyID}&_app_key=${dateNight.yummlyKey}&allowedCourse[]=course^course-Main+Dishes&allowedIngredient[]=${mainIngredient}&maxResult=25`;
    }
    dateNight.findRecipes(activeUrl);
    dateNight.getWine(mainIngredient);
};

dateNight.findRecipes = function(url) {
    activeUrl = url;
    $.ajax({
        url: activeUrl,
        method: "GET",
        dataType: "jsonp",
        headers: {
            "X-Yummly-App-ID":"app-id",
            "X-Yummly-App-Key":"app-key",
            format: "jsonp"
        }
    }).then(function(result) {
        recipeArray = Array.from(result.matches);
        dateNight.pickRecipe(result.matches);
    });
};

dateNight.pickRecipe = function(array) {
    const removed = recipeArray.shift();
    dateNight.getRecipeDetails(recipeArray[0].id);
};

dateNight.getRecipeDetails = function(array) {
    const recipeId = array;
    $.ajax({
        url: `http://api.yummly.com/v1/api/recipe/${recipeId}?_app_id=${dateNight.yummlyID}&_app_key=${dateNight.yummlyKey}`,
        // &maxResult=1 & start=${dateNight.randomRecipeNumber }
        method: "GET",
        dataType: "jsonp",
        headers: {
            "X-Yummly-App-ID":"app-id",
            "X-Yummly-App-Key":"app-key",
            format: "jsonp"
        }
    }).then(function(result) {
        recipeDetails = result;
        dateNight.displayRecipe(recipeDetails);
    });
};
dateNight.displayRecipe = function(array) {
    $('.recipe a').attr('href', array.attribution.url);
    $('.recipe h2').html(array.name);
    $('.recipe img').attr('src',array.images[0].hostedLargeUrl);
    $('.recipe .recipeCredit a').attr('href', array.attribution.url);
    $('.recipe .recipeCredit p').html(array.attribution.text);
    $('.recipe .recipeCredit img').attr('src', array.attribution.logo)
    $('.recipe .cookTime').html(`Cook time: <span class="value">${array.cookTime}</span>`);
    $('.recipe .totalTime').html(`Total time: <span class="value">${array.totalTime}</span>`);
    $('.recipe .servings').html(`Servings: <span class="value">${array.yield}</span>`);

    $("ul.ingredients li").remove();    
    const ingredients = array.ingredientLines;
    for(items in ingredients){
        let singleIngredient = `<li>${ingredients[items]}</li>`;
        $("ul.ingredients").append(singleIngredient);
    }
};

dateNight.getWine = function(mainIngredient) {
    ingredient = mainIngredient;
    keywords = "wine";
    description = "description";

    if (ingredient === "chicken") {
        keywords = "chardonnay+white+wine";
        description = "Pair this recipe with a crisp Chardonnay.";
    } if (ingredient === "turkey") {
        keywords = "chardonnay+white+wine";
        description = "Pair this recipe with a crisp Chardonnay.";
    } else if ( ingredient === "beef") {
        keywords = "red+wine+noir";
        description = "Pair this recipe with a light to medium-bodied Pinot Noir.";
    } else if ( ingredient === "pork") {
        keywords = "pinot+grigio+wine";
        description = "This recipe pairs well with a zesty Pinot Grigio.";
    } else if ( ingredient === "lamb") {
        keywords = "wine+cabernet+merlot";
        description = "Pair this recipe with a lush, full-bodied wine like Merlot or Cabernet Sauvignon.";
    } else if ( ingredient === "veal") {
        keywords = "wine+chianti";
        description = "This recipe paris well with a fruity and acidic Chianti.";        
    } else if ( ingredient === "fish") {
        keywords = "wine+sauvignon+blanc";
        description = "A fresh and floral Sauvignon Blanc will pair nicely with this recipe."
    } else if (ingredient === "shellfish") {
        keywords = "wine+chardonnay";
        description = "Pair this recipe with a crisp Chardonnay."
    } else if (ingredient === "vegetarian") {
        keywords = "wine+red+noir";
        description = "Pair this recipe with a light to medium-bodied Pinot Noir.";
    } else if (ingredient === "vegan") {
        keywords = "wine+zinfandel";
        description = "Pair this recipe with a bold and full-bodied Zinfandel.";
    }
    
    $.ajax({
        url: `http://lcboapi.com/products?access_key=${dateNight.lcboKey}&q=${keywords}&start=2`,
        method: "GET",
        dataType: "json",
        data: {
            Authorization: "Token MDo1OWQ2NDhjYy1jOThhLTExZTctOGU0NS1jYmRlNTZjZTFhMjE6bjFrWlMxYTkyR3hvdzRFY2c2OW1BZWVYQnN1QlR4R3pRMmt6",
            is_dead : false,
            tags: "wine"
        }
    }).then(function(result) {
        wineArray = Array.from(result.result);
        dateNight.pickWine(wineArray);
    });
};

dateNight.pickWine = function (array) {
    wineArray.shift();
    dateNight.displayWine(wineArray[0]);
};

dateNight.displayWine = function (array) {
    $('.wine h2').html(array.name);
    $('.wine img').attr('src', array.image_url);
    $('.wine p').html(description);
};


// Find Recipes

// Listen for user click on one or more different tags for the ingredients (chicken, beef, pork, fish, shellfish, veal, lamb, vegetarian, vegan, gluten - free)
// Listen for user submit
// Remove recipes without those tags from selections from the api
// Return a random recipe from the remaining choices
// Display the recipe on the DOM
// Listen for user click on a button that returns a new random recipe based on the same choices

// Determine Wine Selection

// Have only some types of wine pair with certain recipe main ingredients (maybe an array for each main ingredient that says what it pairs with?)
// Get main ingredient information (somehow) from the recipe
// Based on recipe main ingredient, remove wines that don’t pair well from possible choices
// Make list of three specific wine selections from lcbo
// Display category of wine on the DOM
// Display the three wine suggestions on t
