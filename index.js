import fetch from 'node-fetch'

/*const responseRaw = await fetch('https://bridges.torproject.org/bridges?transport=obfs4', {
  method: 'POST',
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    captcha_challenge_field: '9gtxHgLw1rXFvt91A1U5ppTgKdxdrJLRccgGOdvBzyNDFACH_uEH22GshPr7hXvnxEM3a5jVLSyywybOCJTJ7Q-fd47FBDIcJbaGU-OZYYgcduqkWYz09T_fZpO_r8zWbykqa7SPDD4ZljHXbM7QGWBpBOyZFjzpvlL3791UQoZ-1R6YBWBvPHmaWtzVekhmd9Zwq5ZnmCZsyszFC_GYpTHJkmFupsKBYAWdoxyMtsZS6LI78hRnd_DTEUvsjXzUCUV1DO6cDbAf4OL26k7b6osUn7s2h-CYmuvA1oOi9lh5Ffg29T_mh0zk1eKa0EBYWIjAWWL3ScmQhwiXdTwoVLQJcZKy13fCVoMB_-RaMZUceQ0s',
    captcha_response_field: 'JzjqnEf',
    submit: 'submit'
  })
})*/

const responseRaw = await fetch("https://bridges.torproject.org/bridges?transport=obfs4", {
    "credentials": "omit",
    "headers": {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
        "Content-Type": "application/x-www-form-urlencoded",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    body: new URLSearchParams({
      captcha_challenge_field: 'E8jzI1aD6TuDj1NWEt007XWpzF8NypzI7y3Eli0m8cdKZa3ojH43s_tifa4lFOv9ADj1l2KoRhWqziZq8nnkxeKhhdM5aR2mFQmTOJHO2ZtGVbPPwP--xL6zAD8JMQ5GOmTjA1UMb9MkahqRf7xP2ouacRFgtu7yW3MkmKNQIUZM_gmjJ0PxXhsQhDMlcBMS2IMfddcokHAVaZDenHoJMZp_bl0E8L97Yyt_K9Vn6O7Kli0jRzZg9NEXsZBYvcaSkGo90XYFxlatwSV03UysVTHW4HsYItPG7pz01UWAZm8GeCe5kOlzZKyVg7pMXlZVNTfjZ1V6EtgnbF08XyGUaxmGkVlGEKKrdyF0ODH6NfLj8jvL',
      captcha_response_field: 'dpzgYut',
      submit: 'submit'
    }),
    "method": "POST",
    "mode": "cors"
});

const response = await responseRaw.text()
console.log(responseRaw.status, response)
