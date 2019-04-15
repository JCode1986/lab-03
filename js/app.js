'use strict';

let all_creatures = [];

const creatures_template_source = $('#creature-template').html();
const creature_template = Handlebars.compile(creatures_template_source);

const creature_option_template_source = $('#creature-option-template').html();
const creature_option_template = Handlebars.compile(creature_option_template_source);

function Creature(horn) {
  this.image_url = horn.image_url;
  this.title = horn.title;
  this.description = horn.description;
  this.keyword = horn.keyword;
  this.horns = horn.horns;
}

Creature.prototype.render = function(){
  const new_html = creature_template(this);
  $('main').append(new_html);
}

Creature.prototype.make_option = function(){
  if ($(`option[value=${this.keyword}]`).length) return;
  
  const new_html = creature_option_template(this);
  $('select').append(new_html);
}

const get_creature_data = data => {
  $.get(`${data}`, 'json').then(data => {
    data.forEach(val => all_creatures.push(new Creature(val)));
    all_creatures.forEach(creature => {creature.render()});
    all_creatures.forEach(creature => {creature.make_option()})
  })
}

//filter after clicking keyword

$(document).ready(() => {
  get_creature_data('../data/page-1.json');
  $('select').on('change', function() {
    let select_value = $(this).val();
    $('.card').hide();
    let chosen = $('.card').filter(function(index, item) {
      return $(item).attr('data-keyword') === select_value; //condition
    });
    chosen.show();
    $('.card').css("margin-left", "auto").css("margin-right", "auto");
  });

  // When a user clicks on page1 or page2 button.
  $('header').on('click', 'button', function(event){

    // Empty out creatures in html
    $('main').empty();
    // Empty out array of creatures.
    all_creatures = [];
    // Empty out drop down select of creatures
    $('select').empty();
    if (event.target.textContent === 'page-1') { 
      //load page 1
      get_creature_data('../data/page-1.json');
    } else {
      //load page 2
      get_creature_data('../data/page-2.json');
    } 
  })
});