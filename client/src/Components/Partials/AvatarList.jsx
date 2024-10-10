import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../store/slicesRedux/user";

function AvatarList() {
  const [list, setList] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchAvatar() {
      const response = await fetch("http://localhost:9000/api/v1/avatar/all", {
        method: "GET",
        credentials: "include",
      });
      const datas = await response.json();
      setList(datas);
    }

    fetchAvatar();
  }, []);

  async function submitChangeAvatar(e) {
    e.preventDefault();
    // si aucun nouvel avatar n'est sélectionné, on ne fait rien (pas de fetch)
    if (!newAvatar) return;
    console.log("newAvatar", newAvatar);
    const response = await fetch(
      `http://localhost:9000/api/v1/user/avatar/${newAvatar}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    // voir également la route du fetch -> updateAvatar du fichier controller/user.js
    const data = await response.json();
    console.log(data);
    // mise à jour du state avatar avec le nouvel avatar
    dispatch(setAvatar(data.newAvatar));
  }

  return (
    <aside className="avatar-list">
      <h3 className="avatar-list__title">Choose Your Avatar</h3>
      <form className="avatar-list__form" onSubmit={submitChangeAvatar}>
        <div className="avatar-list__options">
          {list &&
            list.map((avatar) => {
              if (avatar.label !== user.avatar) {
                return (
                  <div key={avatar.id} className="avatar-list__option">
                    <input
                      className="avatar-list__radio"
                      type="radio"
                      name="avatar"
                      id={`avatar-${avatar.id}`}
                      value={avatar.id}
                      onChange={(e) => setNewAvatar(e.target.value)}
                    />
                    <label
                      htmlFor={`avatar-${avatar.id}`}
                      className="avatar-list__label"
                    >
                      <img
                        className="avatar-list__image"
                        src={`/icons/${avatar.label}`}
                        alt={avatar.label}
                      />
                    </label>
                  </div>
                );
              }
              return null;
            })}
        </div>
        <button
          type="submit"
          onClick={submitChangeAvatar}
          className={`avatar-list__button ${!newAvatar ? "disabled" : ""}`}
          disabled={!newAvatar}
        >
          Change Avatar
        </button>
      </form>
    </aside>
  );
}

export default AvatarList;
