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
        formId: "form-addTask",
        dataAttribute: "data",
        deleteDiv: "delete-div",
        inProgressDiv: "#tasks-inProgress",
        completedDiv: "#tasks-completed"
    };

    albyDo.add = function() {
        var inputs = $("#" + defaults.formId + " :input");  //save form inputs 
        var errorMsg = "Enter a Title for this task.";
        //var id, title, description, date; 
        var taskToAdd = {id: '' , title: '', description: '', date: ''};

        //var taskToAdd = $('#taskTitle').val();          //this value needs to be 'cleaned' / escaped
        //$('#taskTitle').val('');  
        
        taskToAdd.id = new Date().getTime();
        taskToAdd.title = inputs[0].value; 
        taskToAdd.description = inputs[1].value; 
        taskToAdd.date = "Due Date: "+ inputs[2].value;

        if (!taskToAdd.title){
            generateAlert( errorMsg );
            return;
        }

/*
        taskToAdd.title = '<'+defaults.taskTagType+'>'+taskToAdd+'</'+defaults.taskTagType+'>'; 
        $('header').append('<button id="changebtn" class="btn btn-primary">Change</button>');
        $('.in-progress').append( $(taskToAdd.title) );
*/        
        addElement( taskToAdd )

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";

    }; //add()

    //Create the ToDo Element
    var addElement = function( taskToAdd ){

        //specify the parent div
        var parent = defaults.inProgressDiv, wrapper;

        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class" : defaults.taskClass,
            "id"    : defaults.taskIdPrefix + taskToAdd.id            
        }).appendTo( parent );


        //this works... wrapper = $('<div>New Text</div>').appendTo( parent );

        $("<div />", {
            "class" : defaults.taskTitle,
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

        //taskToAdd.title = '<'+defaults.taskTagType+'>'+taskToAdd+'</'+defaults.taskTagType+'>'; 
        //$(.defaults.inProgressDiv).append( $(taskToAdd.title) );

    };

    var generateAlert = function( msg ){
        alert( msg );
    }


    albyDo.clear = function(){
        var inputs = $("#" + defaults.formId + " :input");  //save form inputs 
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