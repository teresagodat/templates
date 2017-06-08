(function() {

'use strict';

  var pets=[];
  var isEdit;
  var indexEdit;

  var BASE_URL = 'https://pacific-meadow-64112.herokuapp.com/data-api/';

  var collection = 'tgodat';


  var tableTemplate = Handlebars.compile( $('#tableTemplate').html() );

  var formPetTemplate = Handlebars.compile( $('#formPetTemplate').html());


  getPets();

  function showTable() {
    var data = { petsData : pets };
    var html = tableTemplate( data );
    $('#mainDiv').html( html );
  }


  function showPetAddForm() {
    var data = { isEdit: false }
    var html = formPetTemplate(data);
    $('#mainDiv').html(html);
  }

  function showPetEditForm(petIdVal) {
    var petFound = findPet(petIdVal);
    var data = { isEdit: true, petId: petIdVal, petVal: petFound }
    var html = formPetTemplate(data);
    $('#mainDiv').html(html);
  }


  $.myOnDelete = function (petId) {
    console.log("Deleting: " + petId);
    deletePet(petId);
  }

  $.myOnAddPet = function () {
    console.log("Button Add Pet selected");
    showPetAddForm();
  }

  $.myOnCancel = function () {
    console.log('Cancel button selected');
    showTable();
  }


  $.myOnEdit = function(petId) {
    console.log("Editing " + petId);
    showPetEditForm(petId);
  }


  $.myOnSubmitAdd = function(evt) {
    console.log('Submit (add) button selected');
    evt.preventDefault();
    var formPet = $('form#formPet')[0];
    var pet = new Object;
    pet.petName = formPet.petName.value;
    pet.breed = formPet.breed.value;
    pet.gender = formPet.gender.value;
    createPet(pet);
  }

  $.myOnSubmitEdit = function(evt, petId) {
    console.log('Submit (edit) button selected for ' + petId);
    evt.preventDefault();
    var formPet = $('form#formPet')[0];

    var updatedPet = new Object;
    updatedPet.petName = formPet.petName.value;
    updatedPet.breed = formPet.breed.value;
    updatedPet.gender = formPet.gender.value;
    updatePet(petId, updatedPet);
  }


  function findPet(petId) {
    for (let pet of pets) {
      if (pet._id === petId) {
        return pet;
      }
    }

    return null;
  }


  //=============================================================================


  // copied from REST test
  function reportAjaxError( jqXHR, textStatus, errorThrown ) {
    var msg = 'AJAX error.\n' +
        'Status Code: ' + jqXHR.status + '\n' +
        'Status: ' + textStatus;
    if ( errorThrown ) {
        msg += '\n' + 'Error thrown: ' + errorThrown;
    }
    if ( jqXHR.responseText ) {
        msg += '\n' + 'Response text: ' + jqXHR.responseText;
    }
    console.log(msg);
  }

  function getSuccessHandler(response) {
    pets = response;
    showTable();
  }

  function getPets() {
    $.ajax(BASE_URL + collection,
    {
        method: 'GET',
        success: getSuccessHandler,
        error: reportAjaxError
    } );
  }

  function deleteSuccessHandler(response) {
    getPets();
    showTable();
  }

  function deletePet(petId) {
    $.ajax( BASE_URL + collection + '/' + petId,
    {
        method: 'DELETE',
        success: deleteSuccessHandler,
        error: reportAjaxError
    } );
  }


  function createSuccessHandler(response) {
    getPets();
    showTable();
  }


  function createPet(pet) {
    $.ajax( BASE_URL + collection,
    {
        method: 'POST',
        data: pet,
        success: createSuccessHandler,
        error: reportAjaxError
    } );
  }


  function updateSuccessHandler(response) {
    getPets();
    showTable();
  }


  function updatePet(petId, petData) {
    $.ajax( BASE_URL + collection + '/' + petId,
    {
        method: 'PUT',
        data: petData,
        success: updateSuccessHandler,
        error: reportAjaxError
    } );
  }

})();