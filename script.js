//$( document ).ready(function() {   //this was a wrapper for the whole js file

//global vars
var albyDo = {}, options = {}, settings = {}; 

(function( albyDo, options, settings, $){

	settings = {
		edit: false, 
		parentId: "", 
		editId: "", 
		editTitle: "", 
		editDesc: "", 
		editDate: ""
	}

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
		dragOptions: { 	stack: '.draggable',
						zIndex: 100,
					   	revert: 'invalid',
						revertDuration: 100
		 			 }
	};

//Delete the help box
$('#help-button').on('click', function(){
	$('.helpBox').hide();
});

// default/init actions
$('#btnCancel').hide();

//Add datepicker to duedate
$( "#taskDue" ).datepicker();
$( "#taskDue" ).datepicker("option", "dateFormat", "mm/dd/yy");


//make demo data draggable
$('.task').draggable( defaults.dragOptions );


//Sortable container needs to be built (turn off revert on originating container)
//$('.drop-container').sortable();

//Drop functionality
$('.drop-container').droppable({
	drop: function( event, ui ){
		var taskObject = {id: '' , title: '', description: '', date: ''};
		var dropContainer ;

		taskObject.id = ui.draggable.prop('id');
		taskObject.title = ui.draggable.children('.task-title').text(); 
		taskObject.description = ui.draggable.children('.task-description').text(); 
		taskObject.date = ui.draggable.children('.task-dueDate').text();

		dropContainerId = '#'+$(event.target).prop('id');

		if (ui.draggable.parent().attr("id") != $(event.target).prop('id')) {

			$('#'+taskObject.id).remove();

			addElement( taskObject, dropContainerId );
		} else { 
			$('#'+taskObject.id).draggable( "option", "revert", true )
			$('#'+taskObject.id).draggable( "option", "revertDuration", 100 );
     } //end If
  }  //end Drop:
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


/* this is OLD code to swap containers on doubleclick
	$( 'body' ).on('dblclick', '.task-title, .task-description, .task-dueDate', function( event ) {      
		if ( '#'+$(this).parent().parent().attr('id') === defaults.inProgressDiv ) {	
			$( this ).parent().appendTo( defaults.completedDiv ).hide().slideDown('fast');
		} else {;    	
			$( this ).parent().appendTo( defaults.inProgressDiv ).hide().slideDown('fast');
		}
	});
*/

//***********************************************************************************************

	//Edit selected task on doubleclick
$( 'body' ).on('dblclick', '.task-title, .task-description, .task-dueDate', function( event ) {   

	if(!settings.edit){
		//change the text to Edit instead of add
		$('#labelHead').text( "Edit Task" ); 

		//Change Add button to Save
		$('#btnAddSave').val( "Save Task" ); 

		//show Cancel button
		$('#btnCancel').show();

		//change the button onclick to Delete instead of Clear
		$('#btnClearDelete').val( "DELETE Task" ); 
		$('#btnClearDelete').addClass( "btn-danger" ); 
		//$('#btnClearDelete').onClick( ); 

		$('footer').addClass('edit-mode');
		
		//add oTask as a global that is populated with the current task data?
		var oTask = {
			parentId: $(this).parent().parent().attr('id'),
			id: $(this).parent().attr('id'),
			title: $(this).parent().children('.task-title').text(), 
			description: $(this).parent().children('.task-description').text(),
			dueDate:  $(this).parent().children('.task-dueDate').text()
		};

		$(this).parent().remove() // remove the task wrapper

		settings.edit = true; //turn editing flag on

		albyDo.edit( oTask );       
	}
});
  
/*********************************************************************************************/

  albyDo.edit = function ( oTask ) {
    //delete current task
	$(oTask.parentId).remove();

    // Populate form data from task
    $('#taskTitle').val( oTask.title );
    $('#taskInfo').val( oTask.description );    
    var strip1 = oTask.dueDate.replace("Due Date: ", "");
    strip1 =  strip1.replace(" |  O V E R D U E !", "") ;
    $('#taskDue').val( strip1 );
    //$('#taskDue').val( oTask.dueDate.replace("Due Date:", "") );
    //$('#taskDue').val( $('#taskDue')val(.replace("|  O V E R D U E !", "") );
    
    
    //save to 'global'
	settings.parentId = oTask.parentId;
	settings.editId = oTask.id;
	settings.editTitle = oTask.title;	
	settings.editDesc = oTask.description;
	//settings.editDate = oTask.dueDate;
	var strip2 = oTask.dueDate.replace("Due Date: ", "");
	strip2 = strip2.replace(" |  O V E R D U E !", "");
	settings.editDate = strip2; 
	//settings.editDate = oTask.dueDate.replace("Due Date: ", "");
	//settings.editDate = oTask.dueDate.replace(" |  O V E R D U E !", "");
	

  }


/**************************************************************/

//Add a task (new or edited)
albyDo.add = function( cancel ) {
        var inputs = $( defaults.entryFormId + " :input");  //save form inputs 
        var errorMsg = "Enter a Title for this task.";
        var taskToAdd = {id: '' , title: '', description: '', date: ''};
        var parent = $(defaults.inProgressDiv);

        if (cancel) {
        	// replace with default values
        	taskToAdd.id = settings.editId; 
        	taskToAdd.title = settings.editTitle;
        	taskToAdd.description = settings.editDesc;
        	//taskToAdd.date = "Due Date: "+ inputs[2].value;
        	taskToAdd.date = settings.editDate
        } else {
        	//use user input
        	taskToAdd.id = new Date().getTime();
        	taskToAdd.title = inputs[0].value; 
        	taskToAdd.description = inputs[1].value; 
        	//taskToAdd.date = "Due Date: "+ inputs[2].value;
        	taskToAdd.date = inputs[2].value;
    	}

        if (!taskToAdd.title){
        	generateAlert( errorMsg );
        	return;
        }

        parent = (settings.edit) ? $('#'+settings.parentId) : parent;	

        addElement( taskToAdd, parent );

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";

        // Reset to add if in editing mode
        if ( settings.edit ){
        	resetForm()
		}	

    }; 

    // Reset from edit mode
    var resetForm = function(){
		$('#labelHead').text( "Enter New Task" ); 
		$('#btnAddSave').val( "Add Task" ); 
		$('#btnCancel').hide();
		$('#btnClearDelete').val( "Clear Task" ); 
		$('#btnClearDelete').removeClass( "btn-danger" ); 
		$('footer').removeClass('edit-mode');
		settings.edit = false; 
    }

    //Create the ToDo Element in the passed parent (in-progress/completed) container
    var addElement = function( taskToAdd , parentId ){

        //specify the parent div
        var parent, wrapper;

        if (!parentId){
        	parent = $(defaults.inProgressDiv);
        } else {
        	parent = $(parentId)
        };

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

        //add some info: overdue task, etc
        if ( $('#'+defaults.taskIdPrefix + taskToAdd.id).children('.'+defaults.taskDate).text() ){
        	$('#'+defaults.taskIdPrefix + taskToAdd.id).children('.'+defaults.taskDate).prepend('<span>Due Date: </span>');
        }   
        var convert = $('#'+defaults.taskIdPrefix + taskToAdd.id).children('.'+defaults.taskDate).text().replace("Due Date: ","");
        var parseDate = new Date(convert);
        parseDate = Date.parse(parseDate);
        var now = new Date();
        now = Date.parse(now);
        if (parseDate < now ) {
        	$('#'+defaults.taskIdPrefix + taskToAdd.id).children('.'+defaults.taskDate).append('<span id="overdue"> |  O V E R D U E !</span>');
        }
        /*     
        if (Date( $('#'+defaults.taskIdPrefix + taskToAdd.id).children('.'+defaults.taskDate).text() ) < Date) {
        	$('#'+defaults.taskIdPrefix + taskToAdd.id).children('.'+defaults.taskDate).append('<span id="overdue"> |  O V E R D U E !</span>');
        }
        */
    };

    //Alert messages
    var generateAlert = function( msg ){
    	alert( msg );
    }

    //Clear label inputs
    albyDo.clear = function(){
        var inputs = $( defaults.entryFormId + " :input");  //save form inputs 
        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";

        if ( settings.edit ){ 
        	resetForm();
        }

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