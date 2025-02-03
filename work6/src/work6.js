import React, { useState, useEffect } from 'react';
import { Alert, Card, Button, Table, Form } from 'react-bootstrap';
import { collection, getDocs, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    fname: '',
    lname: '',
    email: '',
    phone: ''
  });
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        readData();
      } else {
        setUser(null);
        setStudents([]);
      }
    });
  }, [auth]);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const googleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const readData = async () => {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStudents(data);
  };

  const autoRead = () => {
    onSnapshot(collection(db, 'students'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(data);
    });
  };

  const insertData = async () => {
    await setDoc(doc(db, 'students', formData.id), formData);
    setFormData({ id: '', title: '', fname: '', lname: '', email: '', phone: '' });
  };

  const editData = (student) => {
    setFormData(student);
  };

  const deleteData = async (id) => {
    if (window.confirm("ต้องการลบข้อมูลใช่หรือไม่?")) {
      await deleteDoc(doc(db, 'students', id));
    }
  };

  if (!user) {
    return (
      <div className="container p-4 text-center">
        <Card>
          <Card.Body>
            <Alert variant="info"><b>Work 6:</b> Please login to access student data</Alert>
            <Button onClick={googleLogin} variant="primary">Login with Google</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Alert variant="info" className="mb-0"><b>Work 6:</b> Firebase with React</Alert>
            <Button onClick={googleLogout} variant="danger">Logout</Button>
          </div>
        </Card.Header>
        <Card.Body>
          <h5>Welcome, {user.displayName}</h5>
          <Button onClick={readData} className="me-2">Read Data</Button>
          <Button onClick={autoRead} variant="success">Auto Read</Button>

          <StudentTable data={students} editData={editData} deleteData={deleteData} />
        </Card.Body>

        <Card.Footer>
          <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br />
          <TextInput label="ID" value={formData.id} onChange={(val) => setFormData({ ...formData, id: val })} style={{ width: 120 }} />
          <TextInput label="คำนำหน้า" value={formData.title} onChange={(val) => setFormData({ ...formData, title: val })} style={{ width: 100 }} />
          <TextInput label="ชื่อ" value={formData.fname} onChange={(val) => setFormData({ ...formData, fname: val })} style={{ width: 120 }} />
          <TextInput label="สกุล" value={formData.lname} onChange={(val) => setFormData({ ...formData, lname: val })} style={{ width: 120 }} />
          <TextInput label="Email" value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} style={{ width: 150 }} />
          <TextInput label="Phone" value={formData.phone} onChange={(val) => setFormData({ ...formData, phone: val })} style={{ width: 120 }} />
          <Button onClick={insertData}>Save</Button>
        </Card.Footer>

        <Card.Footer>
          By 653380129-4 ณัฐภัทร โพธิจันทร์ <br />
          College of Computing, Khon Kaen University
        </Card.Footer>
      </Card>
    </div>
  );
}

function StudentTable({ data, editData, deleteData }) {
  return (
    <Table striped bordered hover className="mt-3">
      <thead>
        <tr>
          <th>รหัส</th>
          <th>คำนำหน้า</th>
          <th>ชื่อ</th>
          <th>สกุล</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.title}</td>
            <td>{student.fname}</td>
            <td>{student.lname}</td>
            <td>{student.email}</td>
            <td>
              <Button variant="warning" size="sm" onClick={() => editData(student)} className="me-2">แก้ไข</Button>
              <Button variant="danger" size="sm" onClick={() => deleteData(student.id)}>ลบ</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function TextInput({ label, value, onChange, style }) {
  return (
    <Form.Group className="mb-2" style={{ display: 'inline-block', marginRight: '10px' }}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={style}
      />
    </Form.Group>
  );
}

export default App;
