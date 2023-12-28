// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


export default function handler(req, res) {
  const users = [
    { name: 'Luis', edad: "25", ciudad: "Lima", pais: "Peru", },
    { name: 'Ana', edad: "20", ciudad: "Santiago", pais: "Chile" },
    { name: 'Maria', edad: "28", ciudad: "Bogotá", pais: "Colombia" },
    { name: 'Carlos', edad: "30", ciudad: "Ciudad de México", pais: "México" },
   
  ];

  res.status(200).json(users);
}
