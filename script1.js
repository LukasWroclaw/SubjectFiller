/**
 * Created by Lukas on 2020-03-01.
 */






function wyborWymagania(element){
                var ths = element;
                var temat = $('tr.tematy.ui-state-active');

                if(parseInt(ths.next().attr('poziom')) > parseInt(ths.attr('poziom')) && !$(this).hasClass('ppwm_used')){
                    return false;
                }

                if(!temat.length){
                    alert('Wybierz temat, by móc mu przypisać wymagania szczegółowe podstawy programowej.');
                    return false;
                }
			
				var urlAjaxAddress = "https://dlsp6.e-oswiata.olesnica.pl/nauczyciel/rozklad/?id=760&edytuj=podstawa&ajax=temat_wymaganie"
				var pageId = document.URL.toString();
				
				if(pageId.includes("1016"))
				{
					urlAjaxAddress = "https://dlsp6.e-oswiata.olesnica.pl/nauczyciel/rozklad/?id=1016&edytuj=podstawa&ajax=temat_wymaganie"
				}
				
				

                $('body').addClass('wczytywanie');
                $.ajax({
                    type: 'POST',
                    url: urlAjaxAddress,
                    data: {
                        id_tematu: temat.attr('id-tematu'),
                        id_podstawy: ths.attr('id-podstawy'),
                        id_wymagania: ths.attr('id-wymagania')
                    },
                    dataType: 'json'
                }).done(function(cnt){

                    $('body').removeClass('wczytywanie');
                    if(cnt.status){
                        if(!cnt.zaznaczone){
                            ths.stop(true,true).removeClass('ui-state-active','fast');
                            for (var index = 0; index < tematy_wymagania[temat.attr('id-tematu')].length; ++index) {
                                if(ths.attr('id-wymagania') == tematy_wymagania[temat.attr('id-tematu')][index])
                                    delete tematy_wymagania[temat.attr('id-tematu')][index];
                            }
                            delete wykWym[ths.attr('id-wymagania')][temat.attr('id-tematu')];
                        }else{
                            ths.stop(true,true).attr('style','border:0;').addClass('ui-state-active','fast');
                            if(tematy_wymagania[temat.attr('id-tematu')] && tematy_wymagania[temat.attr('id-tematu')].length)
                                tematy_wymagania[temat.attr('id-tematu')][tematy_wymagania[temat.attr('id-tematu')].length] = ths.attr('id-wymagania');
                            else{
                                tematy_wymagania[temat.attr('id-tematu')] = [];
                                tematy_wymagania[temat.attr('id-tematu')][0] = ths.attr('id-wymagania');
                            }
                            if(!wykWym[ths.attr('id-wymagania')])
                                wykWym[ths.attr('id-wymagania')] = [];
                            wykWym[ths.attr('id-wymagania')][temat.attr('id-tematu')] = true;
                        }
                        var i;
                        $('.rz_ppwm_ln.ppwm_used').removeClass('ppwm_used');
                        for(i in wykWym){
                            var j, is = false;
                            for(j in wykWym[i])
                                is = true;

                            if(is) $('.rz_ppwm_ln[id-wymagania="'+i+'"]:not(.ppwm_used)').addClass('ppwm_used');
                        }

                    }else{
                        alert('Nie udało się zmienić przypisania tego wymagania szczegółowego do tematu.');
                    }
                })
                .fail(function() {
                    alert('Nie udało się zmienić przypisania tego wymagania szczegółowego do tematu.');
                    $('body').removeClass('wczytywanie');
                });

           

}



function is_numeric(str){
    return /^\d+$/.test(str);
}

function returnOnlyNumericValues(inputString)
{
    var char1 = inputString[0];
    var char2 =  inputString[1];
    var returnString = "";

    if(is_numeric(char1))
    {
        returnString += char1;
    }

    if(is_numeric(char2))
    {
        returnString += char2;
    }


    return returnString;
}

function getCombinedNumberFromString(inputString)
{
    var stringWithLatinNumber = "";
    var stringWithArabicNumber = "";

    var bufor = inputString.trim();

    var splitted = bufor.split(".");

    stringWithLatinNumber =  splitted[0];

    if(splitted.length > 1) {
        stringWithArabicNumber = returnOnlyNumericValues(splitted[1]);
    }
    return [stringWithLatinNumber, stringWithArabicNumber];

}

function splitStringTableIntoArray(inputStringTable)
{
    var splitBySemicolon = inputStringTable.split(";");
    var arrayOfFinalStrings = [];

    splitBySemicolon.forEach(function(item){
        var splitByComma = item.split(",");

        splitByComma.forEach(function(subitem){
            element = subitem.trim();
            arrayOfFinalStrings.push(element);
        });

    });


    return arrayOfFinalStrings;

}

function checkIfNumberMatchWithAnyNumberFromUser(textString, stringArray)
{
    var isMatching = false;
	
	var number = getCombinedNumberFromString(textString);

    stringArray.forEach(function(item){
        var userResult = getCombinedNumberFromString(item);


        if(number[0] == userResult[0] && number[1] == userResult[1])
        {
            isMatching = true;
        }

    });

    return isMatching;
}

function funkcjaWyboruWymagan() {
	
	var userInput = $('#981').val();
		
	numbersFromUser = splitStringTableIntoArray(userInput);
	
	
	$('.rz_ppwm_ln').each(function( index ) {

		rawText = ($( this ).text()).toString();
		var toMark = checkIfNumberMatchWithAnyNumberFromUser(rawText, numbersFromUser);
		if(toMark){
			wyborWymagania($( this ));
		}
		
	});
}


$(document).ready(function() {
	var btn = document.createElement("BUTTON");
	btn.innerHTML = "WYPELNIJ WYMAGANIA";
	document.body.appendChild(btn);
	
	var inputText = document.createElement("INPUT");	
	inputText.setAttribute("type", "text");
	inputText.setAttribute("id", "981");
	inputText.setAttribute("value", "Tu wpisz wymagania");
	document.body.appendChild(inputText);
	
	btn.addEventListener("click", funkcjaWyboruWymagan);

	inputText.addEventListener("keypress", function(e){
		if(e.keyCode === 13)
		{
			funkcjaWyboruWymagan();
		}
	});
});










