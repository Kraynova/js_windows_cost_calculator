$(function(){

  // >> Storage
  // Знает только о форме. На основе ее данных считает конечную сумму
  storage = new Object();
  storage.width = 700;
  storage.height = 1500;
  storage.reload = function(){ // Обновляет себя беря значения из формы
    var params = ['profile', 'glass_pack', 'mounting'];
    var form = $('form'); // element
    var objects = form.serializeArray();
    for (i in objects){
      var object = objects[i];
      if ($.inArray(object.name, params) > -1){
        storage[object.name] = object.value;
      }
    }
  };
  storage.calculate = function(){ // Считает конечную сумму
    this.reload();
    // Здесь какая то формула для расчета стоимости
    return Math.random();
  };
  // <<

  // >> Mediator
  // Для вывода
  var total_size = $('#total_size');
  var total_cost = $('#total_cost');

  // Участвует в обработке
  var types = $('#select .type');
  var canvas = $('#canvas');

  var mediator = function(element, action){ // Mediator pattern
    switch(action) {
      case 'update_size':
        update_size();
        break;
      case 'change_type':
        change_type(element);
        update_size();
      break;
    }

    // Считаем сумму для каждого изменения
    render_total();

    function render_total(){
      total_cost.html(storage.calculate());
    }

    function change_type(element){
      var type_html = $(element).next().html();
      canvas.html(type_html);
    }

    function update_size(){
      storage.width = 0;
      storage.height = 0;
      $('#canvas input.size').each(function(index){ // element
        var value = parseInt(this.value);
        switch(this.name){
          case 'width_1':
          case 'width_2':
            storage.width += value;
          break;
          case 'height_1':
            storage.height = value;
          break;
        }
      })
      total_size.html(storage.width + ' x ' + storage.height);
    }
  }
  // << 

  // >> События
  types.click(function(){
    mediator(this, 'change_type');
    return false;
  });

  $('input.size').live('keyup', (function(){
    mediator(this, 'update_size');
  }));

  $('select').change(function(){
    mediator(this);
  });
  // <<
})
