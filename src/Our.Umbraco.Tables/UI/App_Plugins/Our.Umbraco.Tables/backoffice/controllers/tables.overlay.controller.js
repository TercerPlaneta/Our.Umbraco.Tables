function tablesOverlayController($scope)
{
	$scope.save = function() {
        $scope.$broadcast("formSubmitting", { scope: $scope });
		console.log("$scope",$scope.model);
        $scope.model.submit($scope.model);
    }
}

angular.module("umbraco").controller("Our.Umbraco.Tables.BackOffice.Overlay.Controller", tablesOverlayController);