module.exports = (function () {

  /**
  * Helper for making Elements with attributes
  *
  * @param  {string} tagName           - new Element tag name
  * @param  {Array|string} classNames  - list or name of CSS classname(s)
  * @param  {object} attributes        - any attributes
  * @returns {Element}
  */
  function _make(tagName, classNames, attributes) {

    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      if (((attrName == 'disabled') || (attrName == 'readonly')) && attributes[attrName]) {
        el.setAttribute(attrName, attrName);
      } else {
        // if(attrName == 'value') ,  el[attrName] = attributes[attrName]; fails better use this
        el.setAttribute(attrName, attributes[attrName]);
      }
    }

    return el;
  }

  /**
  * @param {PromptNotifierOptions} options
  * NOTE no notify return because already added by notifier.show
  */
  const demo = function demo(options) {

    const id = options.id;

    const d = _make('div', null, null);

    d.appendChild(document.createTextNode(options.title));

    d.appendChild(_make('hr', null, null));

    // Build the caption input for Url

    d.appendChild(document.createTextNode(options.message));

    d.appendChild(_make('br', null, null));

    let u = _make('input', null, {
      id: 'demo-' + id,
      title: 'Url ' + id,
      type: 'text',
      style: 'width:27em',
      size: '300',
      value: options.url,
      placeholder: options.placeholder,
    });

    d.appendChild(u);

    d.appendChild(_make('br', null, null));

    // Build the caption input text

    d.appendChild(document.createTextNode('Provide a text for the caption (optional)'));
    
    let c = _make('input', null, {
      id: 'demo-' + id + '__caption',
      title: 'Caption ' + id,
      type: 'text',
      style: 'width:27em',
      size: '300',
      value: options.caption || '',
      placeholder: 'your caption text',
    });

    d.appendChild(c);

    // Build the selector for the inject mode (inline or block)

    d.appendChild(document.createTextNode('Inject mode:'));

    const selectList = _make('select', null, {
      id: 'mySelect',
      style: 'margin : 2 5 2 5;',
    });

    var i, option, items = ['inline', 'block'];

    for (i = 0; i < items.length; i++) {
      option = document.createElement('option');
      option.value = items[i];
      option.text = items[i];
      if (i == 0) {
        option.setAttribute('selected', 'selected');
        u.setAttribute('data-mode', items[i]);
      }
      selectList.appendChild(option);
    }

    d.appendChild(selectList);

    d.appendChild(document.createTextNode(' Is it a custom type ? '));

    // Create radio and set default custom to 'No'

    function createRadioElement(name, checked, value) {
      var radioFragment, radioHtml = '<input type="radio" id="' + name + '__' + value + '" name="' + name + '" value="' + value + '"';
      if (checked){
        radioHtml += ' checked="checked"';
      }
      radioHtml += '/>';

      radioFragment = document.createElement('div');
      radioFragment.innerHTML = radioHtml;
     
      return radioFragment.firstChild;
    }

    // Build the custom YES / NO radio group

    d.appendChild(createRadioElement(id + '-custom', false, 'true'));
    d.appendChild(document.createTextNode(' YES '));

    d.appendChild(createRadioElement(id + '-custom', true, 'false'));
    d.appendChild(document.createTextNode(' NO '));

    u.setAttribute('data-custom', 'false');

    d.appendChild(_make('br', null, null));

    // Build the example buttons that will provide sample url for you on click

    d.appendChild(document.createTextNode(' -- OR click on one link example -- '));

    d.appendChild(_make('br', null, null));

    options.samples.forEach(function(sample) {

      const anchor = _make('a', 'sample-demo-' + id, {
        href: '#',
      });

      if (sample.type) {
        delete sample.type;
      }
      sample.interactive = false;

      for (var prop in sample) {
        anchor.setAttribute('data-' + prop, sample[prop]);
      }

      anchor.innerHTML = '<span class="button__' + id + '-demo">' + sample.text + '</span>';
      d.appendChild(anchor);
    });

    notifier.show({
      message: d.innerHTML,
      type: 'confirm',
      okText: 'Ok',
      cancelText: 'Cancel',
      okHandler: function() {

        u = document.getElementById('demo-' + id);
        c = document.getElementById('demo-' + id + '__caption');
        
        // Extract dataset completely from u and stores in data as object more convenient to manipulate

        var data = {};
        
        [].forEach.call(u.attributes, function(attr) {
          if (/^data-/.test(attr.name)) {
            
            var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
              return $1.toUpperCase();
              
            });
            data[camelCaseName] = attr.value;
          }
        });

        // Take account manual change may change url and caption 
        
        data.url = u.value;
        data.title = c.value;
        
        // NOTE:to have a toSource() equivalent for DOMStringMap use 
        // console.log(JSON.stringify(data))

        if (data.url) {
          options.okHandler(data);
        } else {
          options.emptyHandler();
        }

      },
      cancelHandler: function() {
        options.cancelHandler();
      },
      layout: 'middle',
      style: 'sosie-panel-' + id + '-demo',
    });

    // Helper to select a value v in a combolist s 
    
    function setSelectedIndex(s, v) {
      for (i = 0; i < s.options.length; i++) {
        if (s.options[i].text == v) {
          s.options[i].selected = true;
          return;
        }
      }
    }
    
    // Handles click on sample links that should update the value of 'demo-<id>' 
    
    [].forEach.call(document.querySelectorAll('a.sample-demo-' + id), function(el) {
      el.addEventListener('click', function(e) {
        
        u = document.getElementById('demo-' + id);
        const data = e.target.parentElement.dataset;
        u.value = data.url;

        // u.dataset=e.target.parentElement.dataset equivalent
        Object.keys(data).forEach(function(key) {
          var attrName = 'data-' + key.replace(/[A-Z]/g, function($0) {
            return '-' + $0.toLowerCase();
          });
          u.setAttribute(attrName, data[key]);
        });

        // update mode select according to data.mode

        setSelectedIndex(document.getElementById('mySelect'), data.mode);

        // Update radio to data.custom

        document.getElementById(id + '-custom__' + data.custom).checked = true;

        // Update caption text

        document.getElementById('demo-' + id + '__caption').value = data.title;
        
      });
    });
    
    // Save selected mode change  
    
    document.getElementById('mySelect').addEventListener('change', function(e) {
      u.setAttribute('data-mode', this.options[this.selectedIndex].value);
    });
    
    // Save custom radio click state 
    
    ['true', 'false'].forEach(function(item) {
      document.getElementById(id + '-custom__' + item).addEventListener('click', function() {
        u.setAttribute('data-custom', this.value);
      });
    });
  };
  
  /**
  * @param {PromptNotifierOptions} options
  * NOTE no notify return because already added by notifier.show
  */
  const console = function (options) {

    const id = options.id;

    const d = _make('div', null, null);

    d.appendChild(document.createTextNode(options.title));

    d.appendChild(_make('hr', null, null));
    
    let iframe = _make('iframe', null, {
      id: 'demo-console-' + id,
      style: 'width:27em;height: 100%',
      frameborder: '0',
      scrolling: 'yes',
      /*style="width:100%;" height="100%"  
      allowfullscreen*/
    });

    d.appendChild(iframe);
    
    notifier.show({
      message: d.innerHTML,
      layout: options.layout || 'right',
      time: 0,
      style: 'sosie-panel-console-demo',
    });
    
    // Alt. 2: Document write ("old school"), Blob approach is not compatible with IE11
    var doc = document.querySelector('#demo-console-' + id).contentWindow.document;
    doc.open();
    doc.write(options.message);
    doc.close();
    
  };

  return {
    demo,
    console,
  };
})();
