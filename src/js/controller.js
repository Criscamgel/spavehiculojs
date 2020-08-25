var app = angular.module("formLanding", []);
var ingreso;

    app.controller("formController", function($scope, $http){

        /* Reload Temporal */
        $scope.resultado = 3;
        $scope.age = new Date().getFullYear();
        $scope.reload = function()
        {
        window.location="https://www.carroya.com/"; 
        }

        $scope.checkTyc = false;
        $scope.checkCyp = false;

        $scope.documentos = [
            {value:1, name:"Cédula de Ciudadania"},
            {value:2, name:"Cédula de Extrangería"},
            {value:3, name:"NIT"}
           ]

        $scope.ocupaciones = [
            {value:1, name:"Pensionado"},
            {value:2, name:"Empleado"},
            {value:3, name:"Independiente"}
           ]
        $scope.cuotas = [
            {value:48, name:"cuatroocho"},
            {value:60, name:"seiscero"},
            {value:72, name:"sietedos"},
            {value:84, name:"ochocuatro"}
           ]

        $scope.contact = {
            DatosBasicos:{
                TipoDocumento:"",
                NumeroDocumento:""

            },
            DatosFinancieros:{
                ActividadEconomica: 0,
                ActividadIndependiente: 3
            },
            OtrosDatos:{
                AutorizaConsultaCentrales: false,
                AutorizaMareigua: false,
            }
        }
        
        $scope.modal = false;
        $scope.modalDos = false;
        $scope.min = 20000000;
        $scope.minv = 1200000;

        $scope.cuota = 0;
        $scope.tasa = 0.01;

        /* Credenciales */
        $scope.username = "TuCarro";
        $scope.password = "tuC@rr02019";

        /* 1 - Ping */
        /* let urlP= "https://apitst.premiercredit.co:11445/premierservices_api_ext_tst/api/login/echoping" */

        /* 2 - Token */
        let urlT= "https://api.premiercredit.co:11445/PremierServices_API_EXT_TST/api/login/authenticate"
        let headerT = {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
                        'Accept': 'application/json, application/xml, text/plain, text/html, *.*' 
                    }

        let bodyT = {'Username':$scope.username,'Password':$scope.password}
        
        /* 3 - Viable */
        let urlV = "https://api.premiercredit.co:11445/PremierServices_API_EXT_TST/api/viabilizacion/getviabilizacion"

        let bodyV = $scope.contact;

        $scope.desabilitarBtnPrimerPaso = function(){
            return !$scope.contact.OtrosDatos.ValorFinanciar || $scope.contact.OtrosDatos.ValorFinanciar < $scope.min || !$scope.cuotas || !$scope.cuota || $scope.cuota == 0;
        }
               
        $scope.submitForm = function(){
            $scope.contact.DatosBasicos.TipoDocumento = Number($scope.contact.DatosBasicos.TipoDocumento);
            $scope.contact.DatosFinancieros.ActividadEconomica = Number($scope.contact.DatosFinancieros.ActividadEconomica);

            fetch(urlT, {
                method: 'POST',
                body: $.param(bodyT),
                headers: headerT
                })
                .then(function(response) {                   
                        return response.json();                   
                    },              
                    function(error) 
                    {
                        return console.log('An error occurred.', error)
                    })
                    .then(function(response){                       
                        let token = response.Token;       

                        let headerVi = {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                        } 

                   fetch(urlV, {
                    method: 'POST',               
                    body: JSON.stringify(bodyV),
                    headers: headerVi
                    })
                      
                      .then( function(response) {
                          return response.json()
                        })
                      .then(function(result) {
                          return $scope.resultado = result.IdResultado
                        })
                      .catch(function(error) {
                          return console.log('error', error)}
                          );                
                   
                  })
                  
        }

        $scope.calculoCta = function(val) {  

                 
                let valorFinanciarCop = $scope.contact.OtrosDatos.ValorFinanciar
                          
                let nmv = Math.pow((1 + $scope.tasa), (1 / 12)) - 1;
                var seguroCuota = (1200 / 1000000) * valorFinanciarCop;
                let cuota = Number(val);

                var seguroTotal = Math.round(seguroCuota * cuota);
                var vlrActual = Math.round(valorFinanciarCop);
                var vlrPartuno = vlrActual * nmv;
                var vlrPartdos = Math.pow((1 + nmv), - cuota)
                vlrPartdos = 1 - vlrPartdos;
                $scope.cuota = Math.round(vlrPartuno / vlrPartdos);
                              
                
                /* Seguro de la cuota */
                var vlrPartunoSeg = seguroTotal * nmv;
                var vlrPartdosSeg = Math.pow((1 + nmv), - cuota)
                vlrPartdosSeg = 1 - vlrPartdosSeg;
                var seguroCta = (Math.round(vlrPartunoSeg) / vlrPartdosSeg);
                seguroCuota = seguroCta;
                seguroCta = Math.round(seguroCta);
        }

        $scope.reinicioCuota = function(val) {
            
            if(val < $scope.min){
                $scope.cuota = 0;
                $scope.cuota = undefined;
            }
        }

        $scope.mostrarForm = function(){
            return ($scope.modal == true || $scope.modalDos == false) && ($scope.modal == false || $scope.modalDos == true);
        }
    })

    .directive('currencyInput', function($filter, $browser) {
        return {
            require: 'ngModel',
            link: function($scope, $element, $attrs, ngModelCtrl) {
                var listener = function() {
                    var value = $element.val().replace(/,/g, '')
                    $element.val($filter('number')(value, false))
                }
                
                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function(viewValue) {
                    return parseInt(viewValue.replace(/,/g, ''), 10);
                })
                
                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function() {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, false))
                }
                
                $element.bind('change', listener)
                $element.bind('keydown', function(event) {
                    var key = event.keyCode
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) 
                        return 
                    $browser.defer(listener) // Have to do this or changes don't get picked up properly
                })
                
                $element.bind('paste cut', function() {
                    $browser.defer(listener)
    
                })
            }
            
        }
    })
    .directive('replace', function() {
        return {
          require: 'ngModel',
          scope: {
            regex: '@replace',
            with: '@with'
          }, 
          link: function(scope, element, attrs, model) {
            model.$parsers.push(function(val) {
              if (!val) { return; }
              var regex = new RegExp(scope.regex);
              var replaced = val.replace(regex, scope.with); 
              if (replaced !== val) {
                model.$setViewValue(replaced);
                model.$render();
              }         
              return replaced;         
            });
          }
        };
      })

