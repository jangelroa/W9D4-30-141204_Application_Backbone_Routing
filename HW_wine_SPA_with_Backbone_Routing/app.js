var wineSource;
var wineShowTemplate;
var editWineSource;
var editWineTemplate;

$(document).ready(function() {
	//Wine display template
	wineSource = $("#show-wines-template").html();
	wineShowTemplate = Handlebars.compile(wineSource);

	//Edit wine template
	editWineSource = $("#edit-wine-template").html();
	editWineTemplate = Handlebars.compile(editWineSource);
	// WE MOVED THE GET PRODUCTS TO THE getWines method
});

// set our Router
var Router = Backbone.Router.extend({
    routes: {
    		"index": "index",
    		"edit/:id": "edit_wines",
    		"*actions": "index"
    }
});

var router = new Router;

function getWines() {
  // alert("We are at the index");
  //Pull all products from the API
	$.ajax({
		url: "http://daretodiscover.net/wine/",
		type: "GET",
		success: function(data) {
			var html = wineShowTemplate({wineData: data});
			$("#content").html(html);
		},
		error: function() {
			alert("Something went wrong here...");
		}
	});
}

// products_spa/index.html#index working
router.on("route:index", getWines);

// now products_spa/index.html#edit/16 working
router.on("route:edit_wines", function(id) {
	$.ajax({
		url: "http://daretodiscover.net/wine/" + id,
		type: "GET",
		success: function(data) {
			var html = editWineTemplate(data);
			$("#content").html(html);
		},
		error: function(){
			alert("you have problems man!");
		}
	});
});

// Start back
Backbone.history.start();

//When user clicks edit button get the product information
//in preparation for editing
// $(document).on("click", ".edit-button", function(){
	// WE PUT THIS CODE INSIDE router.on(route:edit_wines...
// });

$(document).on("click", "#submit-edits", function(){
	$.ajax({
		url: "http://daretodiscover.net/wine/" + $(this).attr("edit_id"),
		type: "PUT",
		data: {
				name: $("input[name=name]").val(),
				year: $("input[name=year]").val(),
				grapes: $("input[name=grapes]").val(),
				country: $("input[name=country]").val(),
				region: $("input[name=region]").val(),
				description: $("input[name=description]").val(),
				price: $("input[name=price]").val()
		},
		success: function(data) {
			window.location.href = "#index";
		},
		error: function(){
			alert("Something went wrong editing a wine");
		}
	});
});

$(document).on("click", "#add-wine", function(){
	$.ajax({
		url: "http://daretodiscover.net/wine/",
		type: "POST",
		data: {
				name: $("#add-name").val(),
				year: $("#add-year").val(),
				grapes: $("#add-grapes").val(),
				country: $("#add-country").val(),
				region: $("#add-region").val(),
				description: $("#add-description").val(),
				price: $("#add-price").val()
		},
		success: function(){
			$("#add-wine-modal").modal("hide");
			getWines();
		},
		error: function() {
			alert("Something wrong adding a wine");
		}
	});
});

$(document).on("click", ".delete-button", function(){
	$.ajax({
		url: "http://daretodiscover.net/wine/" + $(this).attr("id"),
		type: "DELETE",
		success: function(){
			window.location.href = "#index";
		},
		error: function() {
			alert("Something wrong deleting a wine");
		}
	});
});