var SuomiLinnut = ["alku"];
var LatinaLinnut = ["alku"];
var kausi;
var vuosi;
		
$(document).ready(function(){
	
	$(document).scroll(function() 
	{	
		var y = $(this).scrollTop();
		var pixelit = $( "#heroimage" ).height();
		pixelit += $( "#tervetuloa" ).height();
		pixelit += $( "#laskenta" ).height();
		pixelit += 200;

		if (y > pixelit) 
		{ 
			$('#toTop').fadeIn();
		} 
		else 
		{
			$('#toTop').fadeOut();
		}
	});

	$("#toTop").click(function () {
			$('html, body').animate({
			scrollTop: $("#tulosdiv").offset().top
			}, 2000);
	});
	
	$('#jsontaulukko').hide();
	TeeLintuTaulukot();
	
	$("#aloitusnappi").click(function() 
	{
		$('html, body').animate({
        scrollTop: $("#laskenta").offset().top
		}, 2000);
	});
	
	$("#modaali").click(function()
	{
		$("#lintutaulukko").empty();
	});
		
    $("#laske").click(function(){
	    kausi = $("#kausi").val();
	    vuosi = $("#vuosi").val();
		var url = "http://koivu.luomus.fi/talvilinnut/census.php?year=" + vuosi + "&census=" + kausi +"&json";
		ShowLoading();
		
		$.ajax({
			method: "POST",
			url: "data.php?json=true",
			data: {urldata : url},
			datatype: "json",
			})
			.done(function(response){
			var arr = JSON.parse(response);
			TulostaJSON(arr);
			
		});	
	});
	
	$(document).on('click','#linkki',function(e){
		var id = this.value;
		$.ajax({
			method: "POST",
			url: "data.php?xml=true",
			data: {documentID : id},
			datatype: "xml",
			})
			.done(function(xml){		
			XMLtaulukko(xml);
			})	
	
	});

	function TeeLintuTaulukot()
	{
		$.ajax({
				method: "POST",
				url: "data.php?html=true",
				datatype: "xml",
				})
				.done(function(html){

					$(html).find('#lajilista').each(function(){	
					
							$(this).find('li').each(function(){
								
								LatinaLinnut.push($(this).find('em').text());
								var snimi = $(this).find('a').text();
								var arr = snimi.split("(");
								SuomiLinnut.push(arr[0]);
							});	

					});
					
				})
				
	}
	
});
	
function XMLtaulukko(xml)
{	
	if (kausi == 1)
	{
		kausi = "Syyslaskenta";
	}
	else if (kausi == 2)
	{
		kausi = "Joululaskenta";
	}
	else if (kausi == 3)
	{
		kausi = "Kevätlaskenta";
	}
	
	$('<tr></tr>').html("<th>Laskenta-ajanjakso: " +kausi+ " " +vuosi+ "</th>").appendTo('#lintutaulukko');
	$('<tr></tr>').html('<th>Laji suomeksi</th><th>Laji</th><th>Yksilömäärä, Biotooppi F</th><th>Lajimäärä</th><th>Sukupuolet/Yksilömäärä</th>').appendTo('#lintutaulukko');
				
		$(xml).find('Unit').each(function(){	
				
			var nimi;
			var biotooppi;
			var maara;
			var sukupuolet;	
			var suomiNimi;
			
				$(this).find('MeasurementOrFactAtomised').each(function(){

					var parametri = $(this).find('Parameter').text();
					
						if ( parametri == "InformalNameString")
						{
							nimi = $(this).find('LowerValue').text();
							var tmp = LatinaLinnut.indexOf(nimi);
							suomiNimi = SuomiLinnut[tmp];
						}
						
						if ( parametri == "YksilömääräBiotooppiF")
						{
							biotooppi = $(this).find('LowerValue').text();	
						}
						
						if ( parametri == "Yksilömäärä")
						{
							maara = $(this).find('LowerValue').text();			
						}
						
						if ( parametri == "YksilömääräSukupuolet")
						{
							sukupuolet = $(this).find('LowerValue').text();			
						}
					
				});	
				
				suomiNimi = TarkistaUndefined(suomiNimi);
				nimi = TarkistaUndefined(nimi);
				biotooppi = TarkistaUndefined(biotooppi);
				maara = TarkistaUndefined(maara);
				sukupuolet = TarkistaUndefined(sukupuolet);
				
				$('<tr></tr>').html('<td>' +suomiNimi+ '</td><td>' +nimi+ '</td><td>' +biotooppi+ '</td><td>' +maara+ '</td><td>' +sukupuolet+ '</td>').appendTo('#lintutaulukko');
		});
				
		document.getElementById('laskentaikkuna').style.display='block';
}

function TulostaJSON(arr)
{
	var i;
	var out;
				
		for(i = 0; i < arr.length; i++) 
		{
		
			var pvm = arr[i].date.toString();
			var year = pvm.substring(0, 4);
			var month = pvm.substring(4, 6);
			var day = pvm.substring(6, 8);
			pvm = day + "." + month + "." + year;
			
			out += "<tr><td>" +
			"<button class='w3-btn w3-light-green w3-text-white' id='linkki' value='" + arr[i].documentID + "'>" + arr[i].documentID + "</button>" +
			"</td><td>" +
			pvm +
			"</td><td>" +
			arr[i].team +
			"</td><td>" +
			arr[i].route +
			"</td><td>" +
			arr[i].grid +
			"</td><td>" +
			arr[i].areaID +
			"</td><td>" +
			arr[i].areaName +
			"</td><td>" +
			arr[i].speciesCount +
			"</td><td>" +
			arr[i].individualCount +
			"</td><td>" +
			arr[i].municipality +
			"</td></tr>";
		}								 
		
		var tbody = $("#jsontaulukko tbody");
		if ( tbody.children().length == 0 ) 
		{
			jQuery("#jsontaulukko tbody").append(out);
		}
		else
		{
			jQuery("#jsontaulukko tbody").empty();
			jQuery("#jsontaulukko tbody").append(out);
		}
		
	$('#jsontaulukko').show();
	
	$("#jsontaulukko").tablesorter({
       headers: {  0:{sorter: false},          
          1:{sorter: false},
          2:{sorter: false},
          4:{sorter: false},
          5:{sorter: false},
          6:{sorter: false},
          7:{sorter: false},
          8:{sorter: false}
       } 
      });
     
	HideLoading();
}
	
function TarkistaUndefined(data)
{
	if(typeof data == "undefined")
	{
		data = "-";
	}
	return data;
}

function ShowLoading()
{
	document.getElementById('loading').style.display='block';
}

function HideLoading()
{
	document.getElementById('loading').style.display='none';
}
