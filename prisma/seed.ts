import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed superadmin user
  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@czystepomniki.pl' }
  })

  if (!existingUser) {
    const defaultPassword = 'Admin123!'
    const hashedPassword = Buffer.from(defaultPassword).toString('base64')

    await prisma.user.create({
      data: {
        email: 'admin@czystepomniki.pl',
        passwordHash: hashedPassword,
        name: 'Super Administrator',
        role: 'Djlukas123!!!',
        isFirstLogin: true
      }
    })
    console.log('✅ Superadmin user created: admin@czystepomniki.pl / Admin123!')
  } else {
    console.log('ℹ️ Superadmin user already exists')
  }

  // Seed cemeteries
  const cemeteries = [
    { id: '2Hpa61NA1WfAhCgZ9', name: 'Cmentarz par. św. Wawrzyńca w Gliniance' },
    { id: 'xLvryQ5faizJh7GCA', name: 'Cmentarz parafialny w Wiązownie' },
    { id: 'z6RXiyH19gnZpo12A', name: 'Cmentarz w Dębe Wielkie' },
    { id: '8SLgkRbVCGu1eAc3A', name: 'Cmentarz w Zakręcie' },
    { id: 'dnYJJViWzcH8tNSy9', name: 'Cmentarz Parafialny św. Anny w Długiej Kościelnej' },
    { id: 'mjbGi9em5JH4crJr8', name: 'Cmentarz Mariawicki w Halinowie' },
    { id: 'WtebX5CkHSC3YgKQ6', name: 'Cmentarz parafii Najświętszej Maryi Panny Matki Kościoła w Sulejówku w Warszawie-Wesołej' },
    { id: 'WXD6BJXkFgk31Rni8', name: 'Cmentarz Rzymskokatolicki w Starej Miłośnie' },
    { id: 'po8AUdNzvZRNsy2P6', name: 'Cmentarz Miejski, Kościelna 52, 05-303 Mińsk Mazowiecki' },
    { id: 'VERvXJHtnt8HNNgp8', name: 'Cmentarz jeńców Armii Czerwonej Otwock' },
    { id: '7sd77M2w8sk9orAu5', name: 'Cmentarz parafialny Stara Wieś, Okoły' },
    { id: 'G47vtyRFqVpodP2q8', name: 'Cmentarz Otwocka, 05-430 Dąbrówka' },
    { id: '8e8B7NAJgKkBtzfMA', name: 'Cmentarz Parafialny Michała, Andriollego 84, 05-400 Otwock' },
    { id: 'Dyiv2xi2HmgY3dKA9', name: 'Cmentarz Księdza Władysława Żaboklickiego, 05-480 Karczew' },
    { id: '6d5GzLnFvy7292tL9', name: 'Cmentarz Wawerska 46, 05-420 Józefów' },
    { id: 'DEdr4q2crpfpFsVg7', name: 'Cmentarz Parafialny, Powsin, Ul. Przyczółkowska' },
    { id: 'y2va8AL4PTNR9z95A', name: 'Cmentarz Parafialny, Konstancin Jeziorna' },
    { id: 'XK44c7XnBTMaJKJE7', name: 'Cmentarz w Skolimowie' },
    { id: '727ZVgjUdApd4WG69', name: 'Cmentarz parafialny, Piaseczno, ul. Tadeusza Kościuszki 44' },
    { id: 'tbF8wAnxQTEm1YtS7', name: 'Cmentarz Komunalny w Piasecznie, Julianowska 27' },
    { id: '3BwdvSTvoyNKgQF77', name: 'Cmentarz Przy Parafii Zesłania Ducha Świętego, Stara Iwiczna' },
    { id: 'riokdbtMdbHfdUTu9', name: 'Cmentarz w Pyrach, Farbiarska 30' },
    { id: 'Qv7JY8CdVmm4KT887', name: 'Cmentarz w Grabowie, Poloneza' },
    { id: 'WjHk6V2WzasmriuU7', name: 'Cmentarz na Służewie przy ul. Wałbrzyskiej, Warszawa' },
    { id: 'umSSYYjDZDdJFXEWA', name: 'Cmentarz Wilanowski, Warszawa' },
    { id: 'wwhz1LqrJHjRKo5t7', name: 'Katolicki Cmentarz Parafialny, Warszawa' },
    { id: 'pL2Re3FKNBdhR4426', name: 'Cmentarz Czerniakowski, Warszawa' },
    { id: 'ijjzgkhzXgE1YaSU6', name: 'Cmentarz Parafialny w Raszynie, Warszawa' },
    { id: '9nihrT6RMPY4ZrMw9', name: 'Cmentarz Parafialny Parafii Świętej Teresy, od Dzieciątka Jezus, Warszawa' },
    { id: 'tHxBymtNxGXAYkncA', name: 'Cmentarz Powstańców Warszawy, Warszawa' },
    { id: 'c4LB8ZNboUzhmELW6', name: 'Cmentarz na Solipsach, Warszawa' },
    { id: 'KKuP8ba9XCtcQYoA7', name: 'Cmentarz parafialny, Michałowice' },
    { id: 'iCUZiFJw8sguzEwt7', name: 'Cmentarz Parafii Matki Bożej Częstochowskiej, Piastów' },
    { id: 'a2XEQXMECtCr7FZH8', name: 'Cmentarz Powązkowski, Powązki, Powązkach' },
    { id: 'NDmvh7FKZ3GDkX5bA', name: 'Cmentarz Muzułmański (Tatarski)' },
    { id: 'PnZHgPmZ8k1mnZ3V8', name: 'Cmentarz Wojskowy Powązkowska 43/45, Warszawa' },
    { id: 'HoRtU3xGf6hrHhfKA', name: 'Cmentarz Wawrzyszewski, Wólczyńska 64, 01-908 Warszawa' },
    { id: 'SzuBfcM3QcdDktR18', name: 'Cmentarz Komunalny Północny brama południowa' },
    { id: 'fKFUGwtb2eagQfK49', name: 'Cmentarz komunalny północny Brama Północna' },
    { id: 'vuLNNLaWFTdyjNyp6', name: 'Cmentarz Komunalny Północny brama zachodnia' },
    { id: 'XgW4gVZrt8Pv8wnW8', name: 'Cmentarz Laski, 05-080 Izabelin' },
    { id: 'gKnZuoRkRXjtAR856', name: 'Cmentarz Izabelin' },
    { id: 'kqXKeNsQNnXJpwVu8', name: 'Cmentarz, Umiastowska 48, 05-850 Umiastów' },
    { id: '9czEWZgCvwBHjAF76', name: 'Cmentarz, Parkowa 20, 05-850 Ożarów Mazowiecki' },
    { id: 'EcFaFKn4yPyYhAHZ8', name: 'Cmentarz komunalny, Kiełpin, Łomianki' },
    { id: 'XH56GyJmpjCzXNkr6', name: 'Cmentarz Tarchomiński, Mehoffera, 03-131 Warszawa' },
    { id: 'kJdpq2gUGNCWHU7o6', name: 'Cmentarz ewangelicki osadników niemieckich, Kamykowa 1, 01-999 Warszawa' },
    { id: 'K39UaSSngGnoP3Vg6', name: 'Cmentarz Bródnowski (Bródzieński), św. Wincentego 83, 03-530 Warszawa' },
    { id: 'on96wPzQcSpqkfBB6', name: 'Cmentarz Żydowski na Bródnie, św. Wincentego 15, 03-505 Warszawa' },
    { id: 'FVm2TzBCcTGL8ncLA', name: 'Cmentarz przy Parafii Miłosierdzia Bożego w Ząbkach' },
    { id: 'p7dok1G6Ubbm1z5j9', name: 'Cmentarz Parafialny w Rembertowie, 498, Grzybowa 4, Warszawa' },
    { id: 'E3UMtjujkdXFJEGQ6', name: 'Cmentarz parafialny, aleja Józefa Piłsudskiego, Zielonka' },
    { id: 'g8YsZZahFdbNsW5C7', name: 'Cmentarz Marysin, Korkowa 152, Warszawa' },
    { id: 'ePqnNc1cWGjcG1Js9', name: 'Cmentarz Poległych w Bitwie Warszawskiej 1920 r. Ossów, 05-220 Zielonka' },
    { id: 'rUYRWBbNLNiaR6om7', name: 'Cmentarz Zabraniec, ul. Wspólna' },
    { id: 'bjx53EWFyF8h7ihBA', name: 'Cmentarz w Okuniewie' },
    { id: 'tDf17a97jUdAPw8t9', name: 'Cmentarz, Pustelnik 05-304 Stanisławów' },
    { id: 'EvYaWbeBASt37dRZ8', name: 'Cmentarz Stanisławów, 05-304' },
    { id: 'NvpJmcpj9VnZLrhT9', name: 'Municipal Cemetery, Mińsk Mazowiecki' },
    { id: '93aCAVMqyL3kD4jr5', name: 'Cmentarz parafialny w Żukowie, 05-300 Żukowo' },
    { id: 'AGWq8EgZoAFn6g4a6', name: 'Cmentarz Parafialny w Zamienia' },
    { id: 'pucGBWDfHTrZxc2Y9', name: 'Cmentarz Komunalny, 05-332 Siennica' },
    { id: 'GCVkBN9bzpJmCAMj9', name: 'Cmentarz, 05-303 Ignaców' },
    { id: 'X82wyHi46aP6FDYK6', name: 'Cmentarz rodzin niemieckich, 05-303 Tyborów w Tyborowie,' },
    { id: 'dSwca8uqLqenjWFq7', name: 'Cmentarz Parafii Rzymskokatolickiej św. Anny w Jakubowie, Jakubów 22' },
    { id: 'rSFUyE7RTDeTmuXf8', name: 'Cmentarz Rzymskokatolicki, Henryka Dobrzyckiego, 05-319 Cegłów' },
    { id: '8oY27nueCSVt1hRQ7', name: 'Cmentarz Mariawicki, 05-319 Cegłów' },
    { id: '9pEtjJnQAdQRBKGY6', name: 'Cmentarz Kuflew, 05-320 Kuflew' },
    { id: 't5e9trzUreqdRayFA', name: 'Cmentarz parafialny w Kiczkach, 05-319 Kiczki Pierwsze' },
    { id: 'LEUd6tEzN6PTYjCJ6', name: 'Cmentarz w Zabieżkach, 05-430' },
    { id: 'Jxe1ZD7oNFz3bR556', name: 'Cmentarz Parafialny, 05-340 Kołbiel' },
    { id: 'LLVJyJGBv7qQn4ur9', name: 'Cmentarz w Gocławiu, 3 Maja 70, 08-440 Gocław' },
    { id: 'N6HTUCWqBP7vh6D96', name: 'Cmentarz Komunalny Pruszków - Gąsin, Południowa 5' },
    { id: 'TcuhiFKGqcs5Wu3v7', name: 'Cmentarz, 2 Sierpnia 24, 05-800 Pruszków' },
    { id: 'wMAmBE59CKfs66kD9', name: 'Cmentarz parafialny, Powstańców Warszawy 17, 05-840 Brwinów' },
    { id: 'P3EWCPccSWuFtNzW9', name: 'Cmentarz, Ogrodowa, 05-807 Podkowa Leśna' },
    { id: 'cvy7igLyoUpCkCHi8', name: 'Cmentarz Komorów, Turystyczna 17, 05-806 Komorów' },
    { id: 'ARVDWbBytHgz14YKA', name: 'Cmentarz, Turystyczna, 05-830 Nadarzyn' },
    { id: 'hB6uzdFv7pdVuQjA8', name: 'Cmentarz w Kostowcu, 05-830' },
    { id: 'RF941edoXSJ8vJVv5', name: 'Cmentarz Parafialny w Młochowie, 05-831 Młochów' },
    { id: 'ujjh74wzerigezdY9', name: 'Cmentarz parafialny w Mrokowie, Rejonowa, 05-552' },
    { id: 'VrqFVwKSqwkMrrPG6', name: 'Cmentarz Parafialny w Tarczynie, 1 Maja, 05-555 Tarczyn' },
    { id: 'tKoytWRSu5aX9oeAA', name: 'Cmentarz Parafialny w Złotokłosie, Piaseczyńska 59, 05-504 Złotokłos' },
    { id: 'PaGNsqe3vWiPxxmo8', name: 'Cmentarz Parafialny w Prażmowie, Piotra Czołchańskiego, 05-505' },
    { id: 'CW8QMkkX5Mki95rq5', name: 'Cmentarz Parafialny w Pieczyskach, 05-505 Chynów' },
    { id: 'PCJFGWYtVv2DHVUu8', name: 'Cmentarz, Akacjowa 4, 05-650 Drwalew' },
    { id: 'kDLwMV4W4qdAAHoFA', name: 'Cmentarz Parafialny w Sobikowie, 05-530 Góra Kalwaria' },
    { id: 'Pnp6btpTQaLsq5hWA', name: 'Cmentarz, 05-650 Rososz' },
    { id: 'K6WrPYoB78y7uM638', name: 'Cmentarz Rzymskokatolicki, Kalwaryjska, 05-530 Góra Kalwaria' },
    { id: 'ARNzUTCekhWWuTX99', name: 'Cmentarz, Bielińskiego, 05-530 Czersk' },
    { id: 'PwnwyGrRZjo4C7pU9', name: 'Cmentarz Mariawicki w Pogorzeli, 08-445 Pogorzel' },
    { id: 'uTTKvkrk9aY45oeu7', name: 'Cmentarz, Krakowska, 08-445 Osieck' },
    { id: '96nDGSaEb7rosN419', name: 'Cmentarz, Słoneczna, 08-440 Pilawa' },
    { id: 'XEuFnXrzTJPGegs97', name: 'Cmentarz, Osiecka, 08-400 Miętne' },
    { id: 'amHaN1sGgnpoSivR9', name: 'Cmentarz parafialny w Marianowie, 08-410 Marianów' },
    { id: '5rWgd3ZdeQitYWD88', name: 'Cmentarz parafialny w Górkach, 08-400 Garwolin' },
    { id: 'YjTDMBHiqsHYVX2Z9', name: 'Cmentarz Parafialny, 08-450 Łaskarzew' },
    { id: 'pdofcswxfG5182bz9', name: 'Cmentarz Parafialny, 08-404 Górzno' },
    { id: 'hALEyPX8fE6i5GH79', name: 'Cmentarz Parafialny, Cmentarna 3, 08-400 Garwolin' },
    { id: 'm7q2biAUvRd5g7fC6', name: 'Cmentarz, Garwolińska 2, 08-420 Miastków Kościelny' },
    { id: 'UK4yJF7zm2yNEKKNA', name: 'Cmentarz parafialny Żelechów, Długa, 08-430 Żelechów' },
    { id: 'kckwH9NFsFQvhAgN7', name: 'Cmentarz Parafialny, Krępska 27, 08-460 Sobolew' },
    { id: 'NXw3Qd69nFQ62mw37', name: 'Cmentarz Wolski, Warszawa' },
    { id: 'G348+VQ', name: 'Cmentarz w Serocku' }
  ];

  console.log('🌱 Seeding cemeteries...')
  for (const cemetery of cemeteries) {
    await prisma.cemetery.upsert({
      where: { id: cemetery.id },
      update: { name: cemetery.name },
      create: { id: cemetery.id, name: cemetery.name }
    });
  }
  console.log('✅ Cemeteries seeded')

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })