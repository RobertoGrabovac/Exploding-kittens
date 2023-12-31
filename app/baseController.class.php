<?php

// Bazna apstraktna klasa za sve controllere
abstract class BaseController 
{
	// controller sve podatke koje odhvati iz modela i koje će proslijediti view-u čuva u registry-ju.
	protected $registry;

	function __construct( $registry ) 
	{
		$this->registry = $registry;
	}

	function show( $name ) 
	{
		$path = __DIR__ . '/../view/'.$name.'.php';

		if( file_exists($path) === false )
		{
			throw new Exception( 'Template not found in ' . $path );
		}

		// Stvori par (varijabla, vrijednost) za svaki par (ključ, vrijednost) iz asoc. polja vars.
		// Npr. ako je vars['ime'] = 'Mirko', vars['ocjena'] = 5, ovo će napraviti varijable $ime='Mirko' i $ocjena=5.
		// Tako ćemo iz view-a moći direktno raditi echo $ime, a ne echo $vars['ime'].
		
		foreach( $this->registry->vars as $key => $value )
		{
			$$key = $value;
		}

		// Ovdje ne koristimo require_once, zato da bi controller i više puta mogao prikazati jedan te isti view.
		// (Na primjer, za svakog usera pozove jedan (uvijek isti) view koji prikaže podatke o tom useru.)
		require ($path);

	}
}

?>
