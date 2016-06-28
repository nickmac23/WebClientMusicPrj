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

      function setRoom (data) {
        socketRoom = data
        socket.emit('server', {to: 'electron', room: socketRoom, info: 'from client'})
        socket.on(socketRoom + 'client', function (data) {
          console.log(data);
          vm.socketRoom = true
          vm.list = data;
          $scope.$apply()
        })
      }
    }
  }
}());
