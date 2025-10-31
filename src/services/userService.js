const BASE_URL = `${ import.meta.env.VITE_BACK_END_SERVER_URL || 'https://bitecraft-backend-44f247390d1f.herokuapp.com/'}/users`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export {
  index,
};
