/*jshint -W030 */
describe('traversing', function () {
  'use strict';

  var el = null;
  var $lis = null;

  spec.fixture.init();

  beforeEach(function () {
    el = spec.fixture.get();
    document.body.appendChild(el);
    $lis = $('#fixture-html li');
  });

  afterEach(function () {
    spec.fixture.restore(el);
    el = null;
    $lis = null;
  });

  describe('filter()', function () {
    it('should be defined', function () {
      expect($.fn.filter).to.be.defined;
    });

    it('should filter elements in a collection by function', function () {
      expect($lis.length).to.equal(6);
      var $second = $lis.filter(function (el) {
        return el.id === 'second';
      });
      expect($second.length).to.equal(1);
    });

    it('should filter elements in a collection by selector', function () {
      expect($lis.length).to.equal(6);
      var $second = $lis.filter('#second');
      expect($second.length).to.equal(1);
    });

    it('should filter elements in a collection by dom node or kimbo wrapped', function () {
      var second = document.getElementById('second');
      var first = $('#noexist');

      expect($lis.length).to.equal(6);
      expect($lis.filter(second).length).to.equal(1);
      expect($lis.filter($(second)).length).to.equal(1);
      expect($lis.filter(first).length).to.equal(0);
    });
  });

  describe('eq()', function () {
    it('should be defined', function () {
      expect($.fn.eq).to.be.defined;
    });

    it('should reduce the element collection to the specified index', function () {
      expect($lis.eq(1)[0].id).to.equal('second');
    });

    it('should give me the last item if -1 passed', function () {
      var last = $lis[$lis.length - 1];
      expect($lis.eq(-1)[0]).to.equal(last);
    });
  });

  describe('first()', function () {
    it('should be defined', function () {
      expect($.fn.first).to.be.defined;
    });

    it('should return the first item in the collection', function () {
      var first = $lis[0];
      expect($lis.first()[0]).to.equal(first);
    });
  });

  describe('last()', function () {
    it('should be defined', function () {
      expect($.fn.last).to.be.defined;
    });

    it('should return the last item in the collection', function () {
      var last = $lis[$lis.length - 1];
      expect($lis.last()[0]).to.equal(last);
    });
  });

  describe('slice()', function () {
    it('should be defined', function () {
      expect($.fn.slice).to.be.defined;
    });

    it('should reduce the collection to a subset specified by a range of indices', function () {
      var slice = $lis.slice(0, 3);
      expect(slice[0]).to.equal($lis[0]);
      expect(slice[1]).to.equal($lis[1]);
      expect(slice[2]).to.equal($lis[2]);
    });
  });

  describe('each()', function () {
    it('should be defined', function () {
      expect($.fn.each).to.be.defined;
    });
  });

  describe('map()', function () {
    it('should be defined', function () {
      expect($.fn.map).to.be.defined;
    });

    it('should be apply a function to each element in the collection and return a new set', function () {
      var mapped = $lis.map(function (el) {
        return el.nodeName.toLowerCase();
      });
      expect(mapped).to.be.instanceof(Kimbo);
      expect(mapped.get()).to.deep.equal(['li','li','li','li','li','li']);
    });
  });

  describe('find()', function () {
    it('should be defined', function () {
      expect($.fn.find).to.be.defined;
    });

    it('should return a unique collection', function () {
      var $uls = $('#fixture-html ul').add('#fixture-html');
      var $lis = $uls.find('li');
      expect($lis.length).to.equal(6);
    });
  });

  describe('closest()', function () {
    it('should be defined', function () {
      expect($.fn.closest).to.be.defined;
    });

    it('should return if empty set', function () {
      $([]).closest();
    });

    it('should get a new collection that matches the closest selector', function () {
      var $input = $('#fixture-html #name');
      var $form = $('#fixture-html form');
      expect($input.closest('form')[0]).to.equal($form[0]);
    });

    it('should get a new collection that matches the closest selector for every element in the set', function () {
      var ul1 = $('#fixture-html #list')[0];
      var ul2 = $('#fixture-html #list2')[0];
      var uls = $lis.closest('ul');
      expect(uls[0]).to.equal(ul1);
      expect(uls[1]).to.equal(ul2);
    });
  });

  describe('contains()', function () {
    it('should be defined', function () {
      expect($.fn.contains).to.be.defined;
    });

    it('should determine if an elementis contained by the current matched element', function () {
      var $ul = $('#fixture-html #list');
      var $second = $('#fixture-html #second');
      expect($ul.contains($second)).to.be.true;
      expect($ul.contains('#second')).to.be.true;
    });
  });

  describe('add()', function () {
    it('should be defined', function () {
      expect($.fn.add).to.be.defined;
    });

    it('should add elements to the current collection', function () {
      var $collection = $();
      $collection.add($lis[0]);
      $collection.add('#fixture-html #second');
      $collection.add();
      expect($collection.length).to.equal(2);
      expect($collection[0]).to.equal($lis[0]);
      expect($collection[1]).to.equal($lis[1]);
    });
  });

  describe('is()', function () {
    it('should be defined', function () {
      expect($.fn.is).to.be.defined;
    });

    it('should test the current collection against a selector', function () {
      expect($lis.is('li')).to.be.true;
    });

    it('should test the current collection against a function', function () {
      expect($lis.is(function (el) {
        return el.nodeName.toLowerCase() === 'li';
      })).to.be.true;
    });
  });

  describe('parent()', function () {
    it('should be defined', function () {
      expect($.fn.parent).to.be.defined;
    });

    it('should get the parent element of each element in the collection', function () {
      var parent1 = $('#fixture-html #list')[0];
      var parent2 = $('#fixture-html #list2')[0];
      var parents = $lis.parent();
      expect(parents[0]).to.equal(parent1);
      expect(parents[1]).to.equal(parent2);
    });
  });

  describe('next()', function () {
    it('should be defined', function () {
      expect($.fn.next).to.be.defined;
    });

    it('should get the next element of each element in the collection', function () {
      var list1 = $('#fixture-html #list');
      var list2 = $('#fixture-html #list2');
      var next = list1.next();
      expect(next[0]).to.equal(list2[0]);
    });
  });

  describe('prev()', function () {
    it('should be defined', function () {
      expect($.fn.prev).to.be.defined;
    });

    it('should get the prev element of each element in the collection', function () {
      var list1 = $('#fixture-html #list');
      var list2 = $('#fixture-html #list2');
      var prev = list2.prev();
      expect(prev[0]).to.equal(list1[0]);
    });
  });

  describe('siblings()', function () {
    it('should be defined', function () {
      expect($.fn.siblings).to.be.defined;
    });

    it('should get the sibling elements of each element in the collection', function () {
      var $second = $('#fixture-html #second');
      var siblings = $second.siblings();
      expect(siblings[0]).to.equal($lis[0]);
      expect(siblings[1]).to.equal($lis[2]);
    });
  });

  describe('children()', function () {
    it('should be defined', function () {
      expect($.fn.children).to.be.defined;
    });

    it('should get the children elements of all elements in the collection', function () {
      var $list1 = $('#fixture-html #list');
      var children = $list1.children();
      expect(children[0]).to.equal($lis[0]);
      expect(children[1]).to.equal($lis[1]);
      expect(children[2]).to.equal($lis[2]);
    });

    it('should get the children elements of all elements in the collection filter by selector', function () {
      var $list1 = $('#fixture-html #list');
      var children = $list1.children('#second');
      expect(children[0]).to.equal($lis[1]);
    });

    it('should return if empty set', function () {
      var children = $('#noexist').children();
      expect(children.length).to.equal(0);
      expect(children).to.be.instanceof(Kimbo);
    });
  });

  describe('contents()', function () {
    it('should be defined', function () {
      expect($.fn.contents).to.be.defined;
    });

    it('should get the html document and body of an iframe', function () {
      var $iframe = $('#fixture-html #iframe');
      expect($iframe.contents()[0]).to.exist;
      expect($iframe.contents()[0].body).to.exist;
    });
  });
});
