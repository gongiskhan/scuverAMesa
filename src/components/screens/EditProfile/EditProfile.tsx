import * as React from 'react';
import {ScrollView} from 'react-native';
import HeadingInformation from './HeadingInformation';
import ContactInformationForm from './ContactInformationForm';
import LinkedAccounts from './LinkedAccounts';
import {useEffect, useState} from "react";
import {User} from "@src/models/user";
import {UserService} from "@src/services/user.service";

type EditProfileProps = {};

const EditProfile: React.FC<EditProfileProps> = () => {

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    UserService.observeCurrentUser().subscribe(u => setUser(u));
  });

  return (
    <ScrollView>
      <HeadingInformation user={user} />
      <ContactInformationForm />
      {/*<LinkedAccounts />*/}
    </ScrollView>
  );
};

export default EditProfile;
