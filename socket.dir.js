(function() {
  'use strict';

  var socketRoom =''

  angular.module('app')
  .directive('socketIn', directive)

  function directive () {
    return {
      templateUrl: 'socket.dir.html',
      controller,
      controllerAs: 'vm'
    }

    function controller ($scope) {
      var socket = io.connect('https://fathomless-falls-33454.herokuapp.com/');
      let vm = this
      vm.socketRoom = false
      vm.setRoom = setRoom;
      vm.sendSong = sendSong;
      vm.state = {};

      document.addEventListener('keydown', function (e){
        var obj = {};
        switch (e.which) {
          case 39:
            obj.command = 'next'
            break;
          case 37:
            obj.command = 'back'
            break;
          case 32:
            obj.command = 'space'
            break;
        }
        obj.from = 'socket'
        if(!!obj.command) socket.emit('server', {info: obj, room: socketRoom, to: 'electron'})
      })

      function setRoom (data) {
        socketRoom = data
        socket.emit('server', {to: 'electron', room: socketRoom, info: 'client wants data!'})
        socket.on(socketRoom + 'client', function (data) {
          if (Array.isArray(data)) {
            vm.socketRoom = true
            vm.list = data;
            $scope.$apply()
          } else {
            vm.state = data
            // console.log(vm.state.search.length === 1);
            // if (vm.state.search.length === 1) vm.state.search = "*"
            $scope.$apply();
          }
        })
      }

      function sendSong(path) {
        // path.fill = !!path.fill ? path.fill : '';
        socket.emit('server', {to: 'electron', room: socketRoom, info: path})
      }
    }
  }
}());
