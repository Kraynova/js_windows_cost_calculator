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

  // Для вывода
  var total_size = $('#total_size');
  var total_cost = $('#total_cost');
  var canvas = $('#canvas');

  // >> Mediator

  var mediator = {
    execute: function(element, action){ // Mediator pattern
      switch(action) {
        case 'update_size':
          this.update_size();
          break;
        case 'change_type':
          this.change_type(element);
          this.update_size();
          break;
        case 'change_window':
          this.change_window(element);
          break;
      }

      // Считаем сумму для каждого изменения
      this.render_total();
    },
    // private functions (do it)
    render_total: function(){
      total_cost.html(storage.calculate());
    },

    change_type: function(element){
      var type_html = $(element).next().html();
      canvas.html(type_html);
    },

    change_window: function(element){
      var windows = ['i/window.jpg', 'i/window_pv.jpg', 'i/window_pvo.jpg'];
      var e = $(element).children();
      switch (e.data('window_type')) {
        case 1:
          e.attr('src', windows[2]);
          e.data('window_type', 2);
          break;
        case 2:
          e.attr('src', windows[0]);
          e.data('window_type', 0);
          break;
        default:
          e.attr('src', windows[1]);
          e.data('window_type', 1);
      }
    },

    update_size: function(){
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

  var types = $('#select .type');
  types.click(function(){
    mediator.execute(this, 'change_type');
    return false;
  });

  $('input.size').live('keyup', (function(){
    mediator.execute(this, 'update_size');
  }));

  $('select').change(function(){
    mediator.execute(this);
  });

  $('input:checkbox').change(function(){
    mediator.execute(this);
  });
  
  $('a.window').live('click', function(){
    mediator.execute(this, 'change_window');
    return false;
  });

  // >> Execute
  types.first().click();
  mediator.render_total();
})
