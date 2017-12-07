'use strict';

// definicja funkcji ajax
function ajax(ajaxOptions) {

	// parametry połączenia i jego typu
	var options = {
		type: ajaxOptions.type || "POST",
		url: ajaxOptions.url || "",
		onComplete: ajaxOptions.onComplete || function () {},
		onError: ajaxOptions.onError || function () {},
		onSuccess: ajaxOptions.onSuccess || function () {},
		dataType: ajaxOptions.dataType || "text"
	};

	// funkcja sprawdzająca czy połączenie się udało?
	function httpSuccess(httpRequest) {
		try {
			return (httpRequest.status >= 200 && httpRequest.status < 300 ||
				httpRequest.status == 304 ||
				navigator.userAgent.indexOf("Safari") >= 0 && typeof httpRequest.status == "undefined");
		} catch (e) {
			return false;
		}
	}

	// utworzenie obiektu
	var httpReq = new XMLHttpRequest();

	// otwarcie polaczenia
	httpReq.open(options.type, options.url, true);

    
	// jesli stan dokumentu zostal zmieniony -> httpReq.readyState
	// 0: połączenie nie nawiązane,
	// 1: połączenie nawiązane,
	// 2: żądanie odebrane,
	// 3: przetwarzanie,
	// 4: dane zwrócone i gotowe do użycia.

	httpReq.onreadystatechange = function () {
		
		// jeśli 4: dane zwrócone i gotowe do użycia
		if (httpReq.readyState == 4) {

			// sprawdź status płączenia
			if (httpSuccess(httpReq)) {

				// jesli dane w formacie XML to zworc obiekt returnXML, w przeciwnym wypadku responseText (JSON to tekst)
				var returnData = (options.dataType == "xml") ? httpReq.responseXML : httpReq.responseText;

				// jeśli wszystko OK
				options.onSuccess(returnData);
				// console.log(returnData);

				// zeruj obiekt, aby nie utrzymywać nie potrzebnego już połączenia z serwerem
				httpReq = null;

			} else {

				// w przypadku błędu
				options.onError(httpReq.statusText);
			}

		}

	}

	httpReq.send();
}


document.getElementById('getdata-btn').addEventListener('click', function(){
    console.log('button test');
    
    ajax({
			type: "POST",
			url: "https://akademia108.pl/kurs-front-end/ajax/1-pobierz-dane-programisty.php" ,
			onError: function (msg) {
				console.log(msg);
			},
			onSuccess: function (response) {
    
    console.log('connection test');
    
        var obiektJson = JSON.parse(response);
    
    console.log(obiektJson);
                
            var container = document.createElement('div');      // tworzy element <div>
            var containerId = document.createAttribute('id');   // tworzy atrybut id
            containerId.value = 'dane-programisty';             // ustawia wartość dla atrybutu id
            
            document.body.appendChild(container);               // dodaje element div do elementu <body>
            container.setAttributeNode(containerId);            // dodaj atrybut id do elementu <div>
            container.innerHTML =   'Imię: ' + obiektJson.imie + 
                                    '<br>Nazwisko: ' + obiektJson.nazwisko +
                                    '<br>Zawód: ' + obiektJson.zawod + 
                                    '<br>Firma: ' + obiektJson.firma;
                
           
/*          // wersja skrócona
            var container = document.createElement('div');    
            document.body.appendChild(container);    
            container.setAttribute('id', 'dane-programisty');
            container.innerHTML =   'Imię: ' + obiektJson.imie + 'Nazwisko: ' + obiektJson.nazwisko +
                                    'Zawód: ' + obiektJson.zawod + 'Firma: ' + obiektJson.firma;*/
                
                
            }
 
    });
});