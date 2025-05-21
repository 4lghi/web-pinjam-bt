// Di dalam HTML kamu (pakai JS)
fetch('http://localhost:3000/pinjam-buku', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'abc123',
    namaPeminjam: 'Dian',
    nomorHak: 1234,
    // field lainnya
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(err => console.error(err));
