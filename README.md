## cv-sitesi

xampp çalıştır, pma'da CV isminde database oluştur.

# aşağıdaki kodları sırayla konsola yaz

npm install --save

yarn

knex migrate:latest

knex seed:run

npm start

# artık test.hhtp dosyasındaki urllere istek atıp test gerçekleştirebilirsin.

# Not:

pc localhost olarak ipv6 kullanıyorsa test.hhtp'den işlemler yapabilirsin. Çalışmazsa eğer localhost değişkenini 127.0.0.1 olarak değiştir.

Ayrıca test.http üzerinden test yapacaksan REST Client eklentisini vsCode'a indirmen gerek.
