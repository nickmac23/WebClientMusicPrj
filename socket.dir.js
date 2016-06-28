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
      var socket = io.connect('http://localhost:3000');
      let vm = this
      vm.socketRoom = false
      vm.setRoom = setRoom;
      vm.sendSong = sendSong;

      function setRoom (data) {
        socketRoom = data
        socket.emit('server', {to: 'electron', room: socketRoom, info: 'client wants data!'})
        socket.on(socketRoom + 'client', function (data) {
          if (Array.isArray(data)) {
            vm.socketRoom = true
            vm.list = data;
            $scope.$apply()
          } else {
            console.log(data);
          }
        })
      }

      function sendSong(path) {
        socket.emit('server', {to: 'electron', room: socketRoom, info: path})
      }
    }
  }
}());
