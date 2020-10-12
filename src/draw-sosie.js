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

    // Manual Url input

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

        // Extract dataset

        var data = {};
        
        [].forEach.call(u.attributes, function(attr) {
          if (/^data-/.test(attr.name)) {
            
            var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
              return $1.toUpperCase();
              
            });
            data[camelCaseName] = attr.value;
          }
        });

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

      });
    });
  };

  return {
    demo,
  };
})();
