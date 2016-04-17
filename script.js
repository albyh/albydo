//$( document ).ready(function() {   //this was a wrapper for the whole js file

//global vars
var albyDo = {}, options = {}, settings = {}; 

(function( albyDo, options, settings, $){

	defaults = {
		taskTagType: "p",
		taskClass: "task",
		taskTitle: "task-title",
		taskDesc: "task-description",
		taskDate: "task-dueDate",
		taskIdPrefix: "task-",
		dataAttribute: "data",
		deleteDiv: "delete-div",
		entryFormId: "#form-addTask",
		inProgressDiv: "#tasks-inProgress",
		completedDiv: "#tasks-completed",
		dragOptions: { 	stack: ".draggable",
					   	revert: 'invalid',
						revertDuration: 100
		 			 }
	};

// default/init actions


//Add datepicker to duedate
$( "#taskDue" ).datepicker();
$( "#taskDue" ).datepicker("option", "dateFormat", "mm/dd/yy");


//make demo data draggable
$('.task').draggable( defaults.dragOptions );

//start: function(){ $('#tasks-completed').css( {'min-height': '300px'} ); },

$('.drop-container').droppable({
	drop: function( event, ui ){
		var taskObject = {id: '' , title: '', description: '', date: ''};
		var dropContainer ;

		taskObject.id = ui.draggable.prop('id');
		taskObject.title = ui.draggable.children('.task-title').text(); 
		taskObject.description = ui.draggable.children('.task-description').text(); 
		taskObject.date = ui.draggable.children('.task-dueDate').text();

		dropContainer = '#'+$(event.target).prop('id');

		if (ui.draggable.parent().attr("id") != $(event.target).prop('id')) {

			$('#'+taskObject.id).remove();

			addElement( taskObject, dropContainer );
		} else { 
			$('#'+taskObject.id).draggable( "option", "revert", true )
			$('#'+taskObject.id).draggable( "option", "revertDuration", 100 );
     } //if
  }  // Drop
});

//task highlighting                 
$( 'body' ).on( 'mouseenter', '.task-title, .task-description, .task-dueDate' , function()  {
	$( this ).parent().addClass('hover-task')});

$( 'body' ).on( 'mouseleave', '.task-title, .task-description, .task-dueDate' , function()  {          
	$( this ).parent().removeClass('hover-task')});

//highlight if mouse on task wrapper
$( 'body' ).on( 'mouseenter', '.task' , function()  {
	$( this ).addClass('hover-task')});

$( 'body' ).on( 'mouseleave', '.task' , function()  {          
	$( this ).removeClass('hover-task')});

/*
$( '#tasks-completed' ).on( 'mouseenter', function() {
  $( '#tasks-completed' ).css( {'min-height': '50px'} )
})
*/

//swap container on doubleclick
$( 'body' ).on('dblclick', '.task-title, .task-description, .task-dueDate', function( event ) {      

	if ( '#'+$(this).parent().parent().attr('id') === defaults.inProgressDiv ) {	
		$( this ).parent().appendTo( defaults.completedDiv ).hide().slideDown('fast');
	} else {;    	
		$( this ).parent().appendTo( defaults.inProgressDiv ).hide().slideDown('fast');
	}
});



/**************************************************************/


albyDo.add = function() {
        var inputs = $( defaults.entryFormId + " :input");  //save form inputs 
        var errorMsg = "Enter a Title for this task.";
        //var id, title, description, date; 
        var taskToAdd = {id: '' , title: '', description: '', date: ''};

        taskToAdd.id = new Date().getTime();
        taskToAdd.title = inputs[0].value; 
        taskToAdd.description = inputs[1].value; 
        taskToAdd.date = "Due Date: "+ inputs[2].value;

        if (!taskToAdd.title){
        	generateAlert( errorMsg );
        	return;
        }

        addElement( taskToAdd );

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";

    }; 

    //Create the ToDo Element
    var addElement = function( taskToAdd , parent ){

        //specify the parent div
        var parent, wrapper;

        if (!parent){
        	parent = defaults.inProgressDiv;
        };

        /* why would this ever be false?
        if (!parent) {
            return;
        }
        */

        wrapper = $("<div />", {
        	"class" : defaults.taskClass,
        	"id"    : defaults.taskIdPrefix + taskToAdd.id            
        }).appendTo( parent );

        $("<div />", {        
        	"class" : 'task-title',
        	"text"  : taskToAdd.title
        }).appendTo(wrapper);

        $("<div />", {
        	"class" : defaults.taskDate,
        	"text"  : taskToAdd.date
        }).appendTo(wrapper);

        $("<div />", {
        	"class" : defaults.taskDesc,
        	"text"  : taskToAdd.description
        }).appendTo(wrapper);        

        wrapper.draggable( defaults.dragOptions );

    };




    var generateAlert = function( msg ){
    	alert( msg );
    }


    albyDo.clear = function(){
        var inputs = $( defaults.entryFormId + " :input");  //save form inputs 
        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
    }; 

})( albyDo, options, settings, jQuery );




/*
$( document ).ready(function() {
  //var a = 4;
  //console.log(a);
  $('h1').css('color', 'blue');
  $('body').css('background-color', '#EFF');
  $('#everything').css('font-size', '1.5rem');
  $('#everything').prepend('<button id="buttonFadeOut" class="btn btn-primary">Fade Out</button>');
  $('#buttonFadeOut').on('click', function() {
    $('h1').fadeOut('slow');
  });
  $('#everything').prepend('<button id="buttonFadeIn" class="btn btn-primary">Fade In</button>');
  $('#buttonFadeIn').on('click', function() {
    $('h1').fadeIn(5000);
  });
  $('#change-me').css('display', 'inline');
  $('#secret').css('display', 'inline');
  $('li').append('<p>New text</p>');
  
  var newDiv = $('<h1 class="solution text-center">A new H1 in the header</h1>');
  $('header').append(newDiv);

  $('header').append('<button id="changebtn" class="btn btn-primary">Change</button>');
  $('#changebtn').on('click', function() {
  		newDiv.text("You clicked the button!");
  	});

  //add a click handler to the link:
  //For click and most other events, you can prevent the default behavior by calling 
  //event.preventDefault() in the event handler:
  /*$( 'a' ).click( function( event) {
  	alert( 'This prevents default link click behavior');
  	event.preventDefault();
  });*/
/*
  //add the .addClass() call to the script:
  $('a').addClass('test');
  //To remove an existing class, use .removeClass():
  $('a').removeClass('test');
  
  // the link slowly disappears when clicked.
  $('a').click( function(event) {
  	event.preventDefault();
  	$( this ).hide( 'slow' );
  });


  });*/