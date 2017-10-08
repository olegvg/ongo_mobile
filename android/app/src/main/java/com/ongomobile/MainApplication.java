package com.ongomobile;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.react.modules.network.ReactCookieJarContainer; // https://facebook.github.io/react-native/docs/debugging.html#debugging-with-stetho-http-facebook-github-io-stetho-on-android
import com.facebook.stetho.Stetho;
import okhttp3.OkHttpClient;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.stetho.okhttp3.StethoInterceptor;
import java.util.concurrent.TimeUnit;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new SvgPackage(),
            new MapsPackage(),
            new VectorIconsPackage(),
            new GoogleAnalyticsBridgePackage(),
            new RNDeviceInfo()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  // @Override
  // public void onCreate() {
  //   super.onCreate();
  //   SoLoader.init(this, /* native exopackage */ false);
  //
  //   Stetho.initializeWithDefaults(this);
  //     OkHttpClient client = new OkHttpClient.Builder()
  //     .connectTimeout(0, TimeUnit.MILLISECONDS)
  //     .readTimeout(0, TimeUnit.MILLISECONDS)
  //     .writeTimeout(0, TimeUnit.MILLISECONDS)
  //     .cookieJar(new ReactCookieJarContainer())
  //     .addNetworkInterceptor(new StethoInterceptor())
  //     .build();
  //   OkHttpClientProvider.replaceOkHttpClient(client);  }

  public void onCreate() {
        super.onCreate();
        Stetho.initializeWithDefaults(this);
        OkHttpClient client = new OkHttpClient.Builder()
        .connectTimeout(0, TimeUnit.MILLISECONDS)
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .writeTimeout(0, TimeUnit.MILLISECONDS)
        .cookieJar(new ReactCookieJarContainer())
        .addNetworkInterceptor(new StethoInterceptor())
        .build();
        OkHttpClientProvider.replaceOkHttpClient(client);
  }
}
