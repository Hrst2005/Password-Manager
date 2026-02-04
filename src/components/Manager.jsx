import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    try {
      let req = await fetch("http://localhost:3000/");
      let passwords = await req.json();
      console.log("Fetched passwords:", passwords);
      setPasswordArray(passwords);
    } catch (err) {
      console.error("Error fetching passwords:", err);
      toast("Failed to load passwords", {
        theme: "dark",
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      theme: "dark",
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordRef.current.type = "text";
    console.log(ref.current.src);

    if (
      ref.current.src ===
      "https://pic.onlinewebfonts.com/thumbnails/icons_572334.svg"
    ) {
      ref.current.src =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBbYrpuP5oTHQXP5dHsn2Oym_cW-yjwdr4wQ&s";
      passwordRef.current.type = "text";
    } else {
      ref.current.src =
        "https://pic.onlinewebfonts.com/thumbnails/icons_572334.svg";
      passwordRef.current.type = "password";
    }
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      try {
       
        const res = await fetch("http://localhost:3000/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        console.log("POST response:", data);

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to save");
        }

        setPasswordArray((prev) => [
          ...prev,
          { ...form, _id: data.insertedId },
        ]);

        setform({ site: "", username: "", password: "" });

        toast("Password Saved!!", {
          theme: "dark",
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        console.error("Save error:", err);
        toast("Error: Password not saved!", {
          theme: "dark",
          position: "bottom-left",
        });
      }
    } else {
      toast("Error: Password not saved!", {
        theme: "dark",
        position: "bottom-left",
      });
    }
  };

  const deletePassword = async (_id) => {
    console.log("Deleting password with _id", _id);
    const c = confirm("Do you really want to delete this password?");
    if (!c) return;

    try {
      const res = await fetch(`http://localhost:3000/${_id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("DELETE response:", res.status, data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }

      setPasswordArray((prev) => prev.filter((item) => item._id !== _id));

      toast("Password deleted successfully!", {
        theme: "dark",
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Delete error:", err);
      toast("Failed to delete password!", {
        theme: "dark",
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const editPassword = (_id) => {
    console.log("Editing password with _id", _id);

    const item = passwordArray.find((i) => i._id === _id);
    if (!item) return;

    setform({
      site: item.site,
      username: item.username,
      password: item.password,
    });

    setPasswordArray((prev) => prev.filter((i) => i._id !== _id));
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[ lordiconcopy size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="p-2 md:0 md:mycontainer min-h-[88vh]">
        <h1 className="text-4xl text font-bold text-center">
          <span className="text-green-500"> &lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your own Password Manager
        </p>
        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
          />
          <div className="flex w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="password"
                name="password"
              />
              <span
                className="absolute right-[5px] top-[4px] cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={25}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBbYrpuP5oTHQXP5dHsn2Oym_cW-yjwdr4wQ&s"
                  alt=""
                />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-500 rounded-full px-8 py-2 w-fit  border-4 border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/gzqofmcx.json"
              trigger="hover"
            ></lord-icon>
            Save Password
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div> No passwords to show </div>}

          {passwordArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={item._id || index}>
                      <td className=" py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <a
                            href={item.site}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.site}
                          </a>
                          <div
                            className=" lordiconcopy size-7 cursor-pointer"
                            onClick={() => copyText(item.site)}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "4px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>

                      <td className=" py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <span>{item.username}</span>
                          <div
                            className=" lordiconcopy size-7 cursor-pointer"
                            onClick={() => copyText(item.username)}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "4px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>

                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center">
                          <span>{item.password}</span>
                          <div
                            className=" lordiconcopy size-7 cursor-pointer"
                            onClick={() => copyText(item.password)}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "4px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>

                      <td className="py-2 border border-white text-center">
                        <span
                          className="cursor-pointer"
                          onClick={() => editPassword(item._id)}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                        <span
                          className="cursor-pointer"
                          onClick={() => deletePassword(item._id)}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/xyfswyxf.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;