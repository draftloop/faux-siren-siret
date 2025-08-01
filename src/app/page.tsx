'use client'

import { useState } from 'react';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function verifyLuhn(nombre: string, modulo = 10) {
  nombre = "" + nombre;
  var len = nombre.length,
    bit = 1,
    somme = 0,
    val;

  while (len) {
    val = parseInt(nombre.charAt(--len), 10);
    somme += (bit ^= 1) ? [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][val] : val;
  }

  if (somme === 0) {
    throw new Error("nombre invalide");
  }

  return somme % modulo === 0;
}

function guessLuhn(nombre: string) {
  nombre = "" + nombre + "0";
  var len = nombre.length,
    bit = 1,
    somme = 0,
    val;

  while (len) {
    val = parseInt(nombre.charAt(--len), 10);
    somme += (bit ^= 1) ? [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][val] : val;
  }

  return (10 - (somme % 10)) % 10;
}

function isSiren(siren: string) {
  siren = "" + siren;
  if (siren.length != 9) {
    return false;
  } else if ("" + parseInt(siren, 10) !== "" + siren) {
    return false;
  } else if (!verifyLuhn(siren)) {
    return false;
  }
  return true;
}

function isSiret(siret: string) {
  siret = "" + siret;
  if (siret.length != 14) {
    return false;
  } else if ("" + parseInt(siret, 10) !== "" + siret) {
    return false;
  }

  if (!isSiren(siret.substring(0, 9))) {
    return false;
  }

  if (siret.substring(0, 9) === "356000000" && siret !== "35600000000048") {
    // Siren de la poste mais pas le siret du siège
    if (!verifyLuhn(siret, 5)) {
      return false;
    }
  } else {
    if (!verifyLuhn(siret)) {
      return false;
    }
  }

  return true;
}

function generateSiren() {
  var siren = getRandomInt(1, 9) + Array(7).fill(0).map(() => getRandomInt(0, 9)).join('');
  return siren + guessLuhn(siren);
}

function generateSiret() {
  var siret = generateSiren() + Array(4).fill(0).map(() => getRandomInt(0, 9)).join('');
  return siret + guessLuhn(siret);
}

export default function Page() {
  const [generatedSiren, setGeneratedSiren] = useState('-');
  const [sirenVerify, setSirenVerify] = useState('');
  const [sirenResult, setSirenResult] = useState('-');

  const [generatedSiret, setGeneratedSiret] = useState('-');
  const [siretVerify, setSiretVerify] = useState('');
  const [siretResult, setSiretResult] = useState('-');

  const handleGenerateSiren = () => {
    const siren = generateSiren();
    setGeneratedSiren(siren);
    setSirenVerify(siren);
    const isValid = isSiren(siren);
    setSirenResult(isValid ? 'Valide ✅' : 'Invalide ❌');
  };

  const handleVerifySiren = () => {
    const siren = sirenVerify.replace(/\D/g, '').trim();
    if (siren !== sirenVerify) {
      setSirenVerify(siren);
    }
    const isValid = isSiren(siren);
    setSirenResult(isValid ? 'Valide ✅' : 'Invalide ❌');
  };

  const handleGenerateSiret = () => {
    const siret = generateSiret();
    setGeneratedSiret(siret);
    setSiretVerify(siret);
    const isValid = isSiret(siret);
    setSiretResult(isValid ? 'Valide ✅' : 'Invalide ❌');
  };

  const handleVerifySiret = () => {
    const siret = siretVerify.replace(/\D/g, '').trim();
    if (siret !== siretVerify) {
      setSiretVerify(siret);
    }
    const isValid = isSiret(siret);
    setSiretResult(isValid ? 'Valide ✅' : 'Invalide ❌');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Générateur et vérificateur SIREN/SIRET</h1>

      {/* Section SIREN */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-purple-600">SIREN</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Génération SIREN */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-medium mb-4 text-gray-600">Génération</h3>

            <div className="space-y-4">
              <button
                onClick={handleGenerateSiren}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Générer SIREN
              </button>

              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">SIREN généré :</p>
                <p className="text-lg font-mono font-bold text-gray-600">{generatedSiren}</p>
              </div>
            </div>
          </div>

          {/* Vérification SIREN */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-medium mb-4 text-orange-600">Vérification</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="siren-verify" className="block text-sm font-medium text-gray-700 mb-2">
                  SIREN à vérifier (9 chiffres)
                </label>
                <input
                  type="text"
                  id="siren-verify"
                  placeholder="Un SIREN"
                  value={sirenVerify}
                  onChange={(e) => setSirenVerify(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                />
              </div>

              <button
                onClick={handleVerifySiren}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
              >
                Vérifier SIREN
              </button>

              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">Résultat :</p>
                <p className="text-lg font-semibold text-gray-600">{sirenResult}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section SIRET */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">SIRET</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Génération SIRET */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-medium mb-4 text-gray-600">Génération</h3>

            <div className="space-y-4">
              <button
                onClick={handleGenerateSiret}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Générer SIRET
              </button>

              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">SIRET généré :</p>
                <p className="text-lg font-mono font-bold text-gray-600">{generatedSiret}</p>
              </div>
            </div>
          </div>

          {/* Vérification SIRET */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-medium mb-4 text-orange-600">Vérification</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="siret-verify" className="block text-sm font-medium text-gray-700 mb-2">
                  SIRET à vérifier (14 chiffres)
                </label>
                <input
                  type="text"
                  id="siret-verify"
                  placeholder="Un SIRET"
                  value={siretVerify}
                  onChange={(e) => setSiretVerify(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                />
              </div>

              <button
                onClick={handleVerifySiret}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
              >
                Vérifier SIRET
              </button>

              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">Résultat :</p>
                <p className="text-lg font-semibold text-gray-600">{siretResult}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}